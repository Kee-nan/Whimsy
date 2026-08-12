const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const customListsQ = require('../db/queries/customLists');
const mediaItemsQ = require('../db/queries/mediaItems');
const friendshipsQ = require('../db/queries/friendships');

const shapeItems = (rows) => rows.map(r => ({
  id: `${r.media_type}/${r.external_id}`,
  mediaItemId: r.media_item_id,   // internal PK, used for reorder payloads
  media: r.media_type,
  title: r.title,
  image: r.image_url,
  note: r.note,
  position: r.position,
  addedAt: r.added_at,
}));

router.get('/', authenticateToken, async (req, res) => {
  const lists = await customListsQ.getAllForUser(req.user.id);
  res.json(lists);
});

/**
 * GET /api/custom-lists/for-media?mediaType=movie&id=12345
 * Powers the checkbox-dropdown on the detail page: which of my custom
 * lists already contain this item, so checkboxes can be pre-checked.
 */
router.get('/for-media', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id } = req.query;
    if (!mediaType || !id) return res.status(400).json({ message: 'mediaType and id are required' });

    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, id);
    if (!mediaItem) {
      // Item has never been added anywhere yet — every list is unchecked.
      const lists = await customListsQ.getAllForUser(req.user.id);
      return res.json(lists.map(l => ({ id: l.id, name: l.name, included: false })));
    }
    const membership = await customListsQ.getListsWithMembership(req.user.id, mediaItem.id);
    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch list membership' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, isRanked = false, visibility = 'public' } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'List name is required' });
    if (!['public', 'friends', 'private'].includes(visibility)) {
      return res.status(400).json({ message: 'Invalid visibility value' });
    }
    const list = await customListsQ.createList(req.user.id, name.trim(), description || null, isRanked, visibility);
    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create list' });
  }
});

router.get('/:listId', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    if (list.user_id !== req.user.id) {
      if (list.visibility === 'private') {
        return res.status(403).json({ message: 'This list is private' });
      }
      if (list.visibility === 'friends') {
        const isFriend = await friendshipsQ.areFriends(req.user.id, list.user_id);
        if (!isFriend) return res.status(403).json({ message: 'This list is friends-only' });
      }
    }

    const items = await customListsQ.getItems(listId);
    res.json({ ...list, items: shapeItems(items), isOwner: list.user_id === req.user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch list' });
  }
});

/** Add one item — used by the checkbox dropdown on the detail page. */
router.post('/:listId/items', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { media, note } = req.body; // { id: "movie/123", media: "movie", title, image }
    const externalId = media.id.includes('/') ? media.id.split('/').slice(1).join('/') : media.id;
    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType: media.media, externalId, title: media.title, imageUrl: media.image,
    });

    await customListsQ.addItem(listId, mediaItem.id, note || null);
    res.status(200).json({ message: 'Item added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add item to list' });
  }
});

/** Bulk add — used by the "select multiple from my existing lists" modal. */
router.post('/:listId/items/bulk', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { items } = req.body; // [{ id, media, title, image }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    for (const media of items) {
      const externalId = media.id.includes('/') ? media.id.split('/').slice(1).join('/') : media.id;
      const mediaItem = await mediaItemsQ.upsertMediaItem({
        mediaType: media.media, externalId, title: media.title, imageUrl: media.image,
      });
      await customListsQ.addItem(listId, mediaItem.id);
    }
    res.status(200).json({ message: `${items.length} item(s) added` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to bulk add items' });
  }
});

router.delete('/:listId/items', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { mediaId } = req.body; // composite "mediaType/externalId"
    const [mediaType, ...rest] = mediaId.split('/');
    const externalId = rest.join('/');
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, externalId);
    if (mediaItem) await customListsQ.removeItem(listId, mediaItem.id);

    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

/** Persist a drag-and-drop reorder — only meaningful while ranked, called on Save. */
router.put('/:listId/reorder', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { mediaItemIds } = req.body; // ordered array of internal integer IDs
    if (!Array.isArray(mediaItemIds)) return res.status(400).json({ message: 'mediaItemIds must be an array' });

    await customListsQ.reorderItems(listId, mediaItemIds);
    res.status(200).json({ message: 'Order updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reorder list' });
  }
});

router.put('/:listId', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { name, description, isRanked, visibility } = req.body;
    if (!['public', 'friends', 'private'].includes(visibility)) {
      return res.status(400).json({ message: 'Invalid visibility value' });
    }

    const updated = await customListsQ.updateList(listId, { name, description, isRanked, visibility });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

router.delete('/:listId', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    await customListsQ.deleteList(listId);
    res.status(200).json({ message: 'List deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete list' });
  }
});

module.exports = router;