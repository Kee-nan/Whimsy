--
-- PostgreSQL database dump
--

\restrict tkzkHW6ccxvQpzBtiurKjoWddbIkJwTB7PQa51fBmaDhK3TGFwegwYYCepAwR9p

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.activity_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action_type text NOT NULL,
    media_item_id integer,
    detail jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT activity_log_action_type_check CHECK ((action_type = ANY (ARRAY['list_add'::text, 'list_status_change'::text, 'review_add'::text, 'review_update'::text])))
);


ALTER TABLE public.activity_log OWNER TO whimsy_app;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_log_id_seq OWNER TO whimsy_app;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: custom_list_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_list_items (
    id integer NOT NULL,
    custom_list_id integer NOT NULL,
    media_item_id integer NOT NULL,
    note text,
    "position" integer DEFAULT 0 NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.custom_list_items OWNER TO postgres;

--
-- Name: custom_list_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_list_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_list_items_id_seq OWNER TO postgres;

--
-- Name: custom_list_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_list_items_id_seq OWNED BY public.custom_list_items.id;


--
-- Name: custom_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_lists (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_ranked boolean DEFAULT false NOT NULL,
    visibility text DEFAULT 'public'::text NOT NULL,
    icon_url text,
    CONSTRAINT custom_lists_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'friends'::text, 'private'::text])))
);


ALTER TABLE public.custom_lists OWNER TO postgres;

--
-- Name: custom_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_lists_id_seq OWNER TO postgres;

--
-- Name: custom_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_lists_id_seq OWNED BY public.custom_lists.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    media_item_id integer NOT NULL,
    slot_index smallint NOT NULL,
    CONSTRAINT favorites_slot_index_check CHECK (((slot_index >= 0) AND (slot_index <= 7)))
);


ALTER TABLE public.favorites OWNER TO whimsy_app;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO whimsy_app;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: friendships; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.friendships (
    id integer NOT NULL,
    requester_id integer NOT NULL,
    addressee_id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT friendships_check CHECK ((requester_id <> addressee_id)),
    CONSTRAINT friendships_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text])))
);


ALTER TABLE public.friendships OWNER TO whimsy_app;

--
-- Name: friendships_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.friendships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friendships_id_seq OWNER TO whimsy_app;

--
-- Name: friendships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.friendships_id_seq OWNED BY public.friendships.id;


--
-- Name: list_entries; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.list_entries (
    id integer NOT NULL,
    user_id integer NOT NULL,
    media_item_id integer NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    logged_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT list_entries_status_check CHECK ((status = ANY (ARRAY['current'::text, 'completed'::text, 'futures'::text])))
);


ALTER TABLE public.list_entries OWNER TO whimsy_app;

--
-- Name: list_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.list_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.list_entries_id_seq OWNER TO whimsy_app;

--
-- Name: list_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.list_entries_id_seq OWNED BY public.list_entries.id;


--
-- Name: media_items; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.media_items (
    id integer NOT NULL,
    media_type text NOT NULL,
    external_id text NOT NULL,
    title text NOT NULL,
    image_url text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    cached_at timestamp with time zone DEFAULT now() NOT NULL,
    external_rating numeric(10,2),
    external_rating_count integer,
    CONSTRAINT media_items_media_type_check CHECK ((media_type = ANY (ARRAY['movie'::text, 'show'::text, 'book'::text, 'anime'::text, 'manga'::text, 'game'::text, 'album'::text])))
);


ALTER TABLE public.media_items OWNER TO whimsy_app;

--
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.media_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_items_id_seq OWNER TO whimsy_app;

--
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- Name: review_likes; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.review_likes (
    id integer NOT NULL,
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.review_likes OWNER TO whimsy_app;

--
-- Name: review_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.review_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_likes_id_seq OWNER TO whimsy_app;

--
-- Name: review_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.review_likes_id_seq OWNED BY public.review_likes.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    media_item_id integer NOT NULL,
    rating smallint NOT NULL,
    review_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 0) AND (rating <= 30)))
);


ALTER TABLE public.reviews OWNER TO whimsy_app;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO whimsy_app;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: whimsy_app
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    username public.citext NOT NULL,
    email public.citext NOT NULL,
    password_hash text NOT NULL,
    bio text DEFAULT ''::text,
    view_setting text DEFAULT 'card'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    profile_picture_url text,
    CONSTRAINT users_view_setting_check CHECK ((view_setting = ANY (ARRAY['table'::text, 'card'::text])))
);


ALTER TABLE public.users OWNER TO whimsy_app;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: whimsy_app
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO whimsy_app;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: whimsy_app
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: custom_list_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_list_items ALTER COLUMN id SET DEFAULT nextval('public.custom_list_items_id_seq'::regclass);


--
-- Name: custom_lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_lists ALTER COLUMN id SET DEFAULT nextval('public.custom_lists_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: friendships id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.friendships ALTER COLUMN id SET DEFAULT nextval('public.friendships_id_seq'::regclass);


--
-- Name: list_entries id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.list_entries ALTER COLUMN id SET DEFAULT nextval('public.list_entries_id_seq'::regclass);


--
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- Name: review_likes id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.review_likes ALTER COLUMN id SET DEFAULT nextval('public.review_likes_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: custom_list_items custom_list_items_custom_list_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_custom_list_id_media_item_id_key UNIQUE (custom_list_id, media_item_id);


--
-- Name: custom_list_items custom_list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_pkey PRIMARY KEY (id);


--
-- Name: custom_lists custom_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_lists
    ADD CONSTRAINT custom_lists_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- Name: favorites favorites_user_id_slot_index_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_slot_index_key UNIQUE (user_id, slot_index);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- Name: friendships friendships_requester_id_addressee_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_addressee_id_key UNIQUE (requester_id, addressee_id);


--
-- Name: list_entries list_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_pkey PRIMARY KEY (id);


--
-- Name: list_entries list_entries_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- Name: media_items media_items_media_type_external_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_media_type_external_id_key UNIQUE (media_type, external_id);


--
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_pkey PRIMARY KEY (id);


--
-- Name: review_likes review_likes_review_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_user_id_key UNIQUE (review_id, user_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_activity_log_user_created; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_activity_log_user_created ON public.activity_log USING btree (user_id, created_at DESC);


--
-- Name: idx_custom_list_items_list; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_custom_list_items_list ON public.custom_list_items USING btree (custom_list_id);


--
-- Name: idx_custom_list_items_media_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_custom_list_items_media_item ON public.custom_list_items USING btree (media_item_id);


--
-- Name: idx_custom_lists_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_custom_lists_user ON public.custom_lists USING btree (user_id);


--
-- Name: idx_favorites_media_item; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_favorites_media_item ON public.favorites USING btree (media_item_id);


--
-- Name: idx_friendships_addressee; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_friendships_addressee ON public.friendships USING btree (addressee_id, status);


--
-- Name: idx_friendships_requester; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_friendships_requester ON public.friendships USING btree (requester_id, status);


--
-- Name: idx_list_entries_user_status; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_list_entries_user_status ON public.list_entries USING btree (user_id, status);


--
-- Name: idx_media_items_external_rating; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_media_items_external_rating ON public.media_items USING btree (external_rating) WHERE (external_rating IS NOT NULL);


--
-- Name: idx_review_likes_review; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_review_likes_review ON public.review_likes USING btree (review_id);


--
-- Name: idx_reviews_media_item; Type: INDEX; Schema: public; Owner: whimsy_app
--

CREATE INDEX idx_reviews_media_item ON public.reviews USING btree (media_item_id);


--
-- Name: activity_log activity_log_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: activity_log activity_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: custom_list_items custom_list_items_custom_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_custom_list_id_fkey FOREIGN KEY (custom_list_id) REFERENCES public.custom_lists(id) ON DELETE CASCADE;


--
-- Name: custom_list_items custom_list_items_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: custom_lists custom_lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_lists
    ADD CONSTRAINT custom_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friendships friendships_addressee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: friendships friendships_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: list_entries list_entries_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: list_entries list_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: whimsy_app
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO whimsy_app;


--
-- Name: TABLE custom_list_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.custom_list_items TO whimsy_app;


--
-- Name: SEQUENCE custom_list_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.custom_list_items_id_seq TO whimsy_app;


--
-- Name: TABLE custom_lists; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.custom_lists TO whimsy_app;


--
-- Name: SEQUENCE custom_lists_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.custom_lists_id_seq TO whimsy_app;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO whimsy_app;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO whimsy_app;


--
-- PostgreSQL database dump complete
--

\unrestrict tkzkHW6ccxvQpzBtiurKjoWddbIkJwTB7PQa51fBmaDhK3TGFwegwYYCepAwR9p

