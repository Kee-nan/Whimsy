const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const customListsQ = require('../db/queries/customLists');
const mediaItemsQ = require('../db/queries/mediaItems');

const shapeItems = (rows) => rows.map(r => ({
  id: `${r.media_type}/${r.external_id}`,
  media: r.media_type,
  title: r.title,
  image: r.image_url,
  note: r.note,
  addedAt: r.added_at,
}));

router.get('/', authenticateToken, async (req, res) => {
  const lists = await customListsQ.getAllForUser(req.user.id);
  res.json(lists);
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, isPublic = true } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'List name is required' });
    const list = await customListsQ.createList(req.user.id, name.trim(), description || null, isPublic);
    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create list' });
  }
});

router.get('/:listId', authenticateToken, async (req, res) => {
  const listId = parseInt(req.params.listId, 10);
  const list = await customListsQ.getById(listId);
  if (!list) return res.status(404).json({ message: 'List not found' });

  // owner can always see it; anyone can see it only if public
  if (list.user_id !== req.user.id && !list.is_public) {
    return res.status(403).json({ message: 'This list is private' });
  }

  const items = await customListsQ.getItems(listId);
  res.json({ ...list, items: shapeItems(items) });
});

router.post('/:listId/items', authenticateToken, async (req, res) => {
  try {
    const listId = parseInt(req.params.listId, 10);
    const list = await customListsQ.getById(listId);
    if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

    const { media, note } = req.body; // media: { id: "movie/123", media: "movie", title, image }
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

router.delete('/:listId/items/:mediaItemId', authenticateToken, async (req, res) => {
  const listId = parseInt(req.params.listId, 10);
  const mediaItemId = parseInt(req.params.mediaItemId, 10);
  const list = await customListsQ.getById(listId);
  if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

  await customListsQ.removeItem(listId, mediaItemId);
  res.status(200).json({ message: 'Item removed' });
});

router.put('/:listId', authenticateToken, async (req, res) => {
  const listId = parseInt(req.params.listId, 10);
  const list = await customListsQ.getById(listId);
  if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

  const updated = await customListsQ.updateList(listId, req.body);
  res.json(updated);
});

router.delete('/:listId', authenticateToken, async (req, res) => {
  const listId = parseInt(req.params.listId, 10);
  const list = await customListsQ.getById(listId);
  if (!list || list.user_id !== req.user.id) return res.status(403).json({ message: 'Not your list' });

  await customListsQ.deleteList(listId);
  res.status(200).json({ message: 'List deleted' });
});

module.exports = router;