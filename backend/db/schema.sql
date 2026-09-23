--
-- PostgreSQL database dump
--

\restrict PksCnYxjWxEVcrZmn2m2LbEf31OlNM5XN1xLkqwGDPB0QxqXSC1UM4p3ZdYXgWj

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-22 22:36:30

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
-- TOC entry 2 (class 3079 OID 16390)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 233 (class 1259 OID 16664)
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 232 (class 1259 OID 16663)
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 232
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- TOC entry 237 (class 1259 OID 17018)
-- Name: custom_list_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_list_items (
    id integer NOT NULL,
    custom_list_id integer NOT NULL,
    media_item_id integer NOT NULL,
    note text,
    "position" integer DEFAULT 0 NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 17017)
-- Name: custom_list_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_list_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 236
-- Name: custom_list_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_list_items_id_seq OWNED BY public.custom_list_items.id;


--
-- TOC entry 235 (class 1259 OID 16995)
-- Name: custom_lists; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 234 (class 1259 OID 16994)
-- Name: custom_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 234
-- Name: custom_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_lists_id_seq OWNED BY public.custom_lists.id;


--
-- TOC entry 245 (class 1259 OID 34237)
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 34236)
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_verification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 244
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_verification_tokens_id_seq OWNED BY public.email_verification_tokens.id;


--
-- TOC entry 227 (class 1259 OID 16574)
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    media_item_id integer NOT NULL,
    slot_index smallint NOT NULL,
    CONSTRAINT favorites_slot_index_check CHECK (((slot_index >= 0) AND (slot_index <= 7)))
);


--
-- TOC entry 226 (class 1259 OID 16573)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 226
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- TOC entry 231 (class 1259 OID 16630)
-- Name: friendships; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 230 (class 1259 OID 16629)
-- Name: friendships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.friendships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 230
-- Name: friendships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.friendships_id_seq OWNED BY public.friendships.id;


--
-- TOC entry 225 (class 1259 OID 16543)
-- Name: list_entries; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 224 (class 1259 OID 16542)
-- Name: list_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.list_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 224
-- Name: list_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.list_entries_id_seq OWNED BY public.list_entries.id;


--
-- TOC entry 223 (class 1259 OID 16523)
-- Name: media_items; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 222 (class 1259 OID 16522)
-- Name: media_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 222
-- Name: media_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_items_id_seq OWNED BY public.media_items.id;


--
-- TOC entry 243 (class 1259 OID 34214)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 34213)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 242
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 241 (class 1259 OID 34190)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone
);


--
-- TOC entry 240 (class 1259 OID 34189)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 240
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 239 (class 1259 OID 17113)
-- Name: review_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_likes (
    id integer NOT NULL,
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 17112)
-- Name: review_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 238
-- Name: review_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_likes_id_seq OWNED BY public.review_likes.id;


--
-- TOC entry 229 (class 1259 OID 16600)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 228 (class 1259 OID 16599)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 228
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 221 (class 1259 OID 16496)
-- Name: users; Type: TABLE; Schema: public; Owner: -
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
    email_verified boolean DEFAULT false NOT NULL,
    CONSTRAINT users_view_setting_check CHECK ((view_setting = ANY (ARRAY['table'::text, 'card'::text])))
);


--
-- TOC entry 220 (class 1259 OID 16495)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4982 (class 2604 OID 16667)
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- TOC entry 4990 (class 2604 OID 17021)
-- Name: custom_list_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_list_items ALTER COLUMN id SET DEFAULT nextval('public.custom_list_items_id_seq'::regclass);


--
-- TOC entry 4985 (class 2604 OID 16998)
-- Name: custom_lists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_lists ALTER COLUMN id SET DEFAULT nextval('public.custom_lists_id_seq'::regclass);


--
-- TOC entry 4999 (class 2604 OID 34240)
-- Name: email_verification_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.email_verification_tokens_id_seq'::regclass);


--
-- TOC entry 4974 (class 2604 OID 16577)
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- TOC entry 4978 (class 2604 OID 16633)
-- Name: friendships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships ALTER COLUMN id SET DEFAULT nextval('public.friendships_id_seq'::regclass);


--
-- TOC entry 4970 (class 2604 OID 16546)
-- Name: list_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_entries ALTER COLUMN id SET DEFAULT nextval('public.list_entries_id_seq'::regclass);


--
-- TOC entry 4967 (class 2604 OID 16526)
-- Name: media_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items ALTER COLUMN id SET DEFAULT nextval('public.media_items_id_seq'::regclass);


--
-- TOC entry 4997 (class 2604 OID 34217)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 4995 (class 2604 OID 34193)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4993 (class 2604 OID 17116)
-- Name: review_likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_likes ALTER COLUMN id SET DEFAULT nextval('public.review_likes_id_seq'::regclass);


--
-- TOC entry 4975 (class 2604 OID 16603)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16499)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5045 (class 2606 OID 16679)
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5051 (class 2606 OID 17034)
-- Name: custom_list_items custom_list_items_custom_list_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_custom_list_id_media_item_id_key UNIQUE (custom_list_id, media_item_id);


--
-- TOC entry 5053 (class 2606 OID 17032)
-- Name: custom_list_items custom_list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5048 (class 2606 OID 17011)
-- Name: custom_lists custom_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_lists
    ADD CONSTRAINT custom_lists_pkey PRIMARY KEY (id);


--
-- TOC entry 5073 (class 2606 OID 34250)
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 5075 (class 2606 OID 34252)
-- Name: email_verification_tokens email_verification_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 5027 (class 2606 OID 16584)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 16588)
-- Name: favorites favorites_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- TOC entry 5031 (class 2606 OID 16586)
-- Name: favorites favorites_user_id_slot_index_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_slot_index_key UNIQUE (user_id, slot_index);


--
-- TOC entry 5039 (class 2606 OID 16648)
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- TOC entry 5041 (class 2606 OID 16650)
-- Name: friendships friendships_requester_id_addressee_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_addressee_id_key UNIQUE (requester_id, addressee_id);


--
-- TOC entry 5023 (class 2606 OID 16559)
-- Name: list_entries list_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 16561)
-- Name: list_entries list_entries_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- TOC entry 5018 (class 2606 OID 16541)
-- Name: media_items media_items_media_type_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_media_type_external_id_key UNIQUE (media_type, external_id);


--
-- TOC entry 5020 (class 2606 OID 16539)
-- Name: media_items media_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_items
    ADD CONSTRAINT media_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5069 (class 2606 OID 34227)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 5071 (class 2606 OID 34229)
-- Name: password_reset_tokens password_reset_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 5064 (class 2606 OID 34203)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 5066 (class 2606 OID 34205)
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 5058 (class 2606 OID 17123)
-- Name: review_likes review_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 17125)
-- Name: review_likes review_likes_review_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_user_id_key UNIQUE (review_id, user_id);


--
-- TOC entry 5035 (class 2606 OID 16616)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 5037 (class 2606 OID 16618)
-- Name: reviews reviews_user_id_media_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_media_item_id_key UNIQUE (user_id, media_item_id);


--
-- TOC entry 5011 (class 2606 OID 16521)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5013 (class 2606 OID 16517)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 16519)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5046 (class 1259 OID 16690)
-- Name: idx_activity_log_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_log_user_created ON public.activity_log USING btree (user_id, created_at DESC);


--
-- TOC entry 5054 (class 1259 OID 17046)
-- Name: idx_custom_list_items_list; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_custom_list_items_list ON public.custom_list_items USING btree (custom_list_id);


--
-- TOC entry 5055 (class 1259 OID 25330)
-- Name: idx_custom_list_items_media_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_custom_list_items_media_item ON public.custom_list_items USING btree (media_item_id);


--
-- TOC entry 5049 (class 1259 OID 17045)
-- Name: idx_custom_lists_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_custom_lists_user ON public.custom_lists USING btree (user_id);


--
-- TOC entry 5076 (class 1259 OID 34258)
-- Name: idx_email_verification_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_user ON public.email_verification_tokens USING btree (user_id);


--
-- TOC entry 5032 (class 1259 OID 25329)
-- Name: idx_favorites_media_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_favorites_media_item ON public.favorites USING btree (media_item_id);


--
-- TOC entry 5042 (class 1259 OID 16661)
-- Name: idx_friendships_addressee; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_friendships_addressee ON public.friendships USING btree (addressee_id, status);


--
-- TOC entry 5043 (class 1259 OID 16662)
-- Name: idx_friendships_requester; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_friendships_requester ON public.friendships USING btree (requester_id, status);


--
-- TOC entry 5021 (class 1259 OID 16572)
-- Name: idx_list_entries_user_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_list_entries_user_status ON public.list_entries USING btree (user_id, status);


--
-- TOC entry 5016 (class 1259 OID 25332)
-- Name: idx_media_items_external_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_items_external_rating ON public.media_items USING btree (external_rating) WHERE (external_rating IS NOT NULL);


--
-- TOC entry 5067 (class 1259 OID 34235)
-- Name: idx_password_reset_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_user ON public.password_reset_tokens USING btree (user_id);


--
-- TOC entry 5061 (class 1259 OID 34212)
-- Name: idx_refresh_tokens_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_hash ON public.refresh_tokens USING btree (token_hash);


--
-- TOC entry 5062 (class 1259 OID 34211)
-- Name: idx_refresh_tokens_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_user ON public.refresh_tokens USING btree (user_id);


--
-- TOC entry 5056 (class 1259 OID 25331)
-- Name: idx_review_likes_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_likes_review ON public.review_likes USING btree (review_id);


--
-- TOC entry 5033 (class 1259 OID 25328)
-- Name: idx_reviews_media_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_media_item ON public.reviews USING btree (media_item_id);


--
-- TOC entry 5085 (class 2606 OID 16685)
-- Name: activity_log activity_log_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 16680)
-- Name: activity_log activity_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5088 (class 2606 OID 17035)
-- Name: custom_list_items custom_list_items_custom_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_custom_list_id_fkey FOREIGN KEY (custom_list_id) REFERENCES public.custom_lists(id) ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 17040)
-- Name: custom_list_items custom_list_items_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_list_items
    ADD CONSTRAINT custom_list_items_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 17012)
-- Name: custom_lists custom_lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_lists
    ADD CONSTRAINT custom_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 34253)
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 16594)
-- Name: favorites favorites_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 16589)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5083 (class 2606 OID 16656)
-- Name: friendships friendships_addressee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 16651)
-- Name: friendships friendships_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5077 (class 2606 OID 16567)
-- Name: list_entries list_entries_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- TOC entry 5078 (class 2606 OID 16562)
-- Name: list_entries list_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.list_entries
    ADD CONSTRAINT list_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5093 (class 2606 OID 34230)
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 34206)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5090 (class 2606 OID 17126)
-- Name: review_likes review_likes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 17131)
-- Name: review_likes review_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_likes
    ADD CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5081 (class 2606 OID 16624)
-- Name: reviews reviews_media_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_media_item_id_fkey FOREIGN KEY (media_item_id) REFERENCES public.media_items(id) ON DELETE CASCADE;


--
-- TOC entry 5082 (class 2606 OID 16619)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-09-22 22:36:39

--
-- PostgreSQL database dump complete
--

\unrestrict PksCnYxjWxEVcrZmn2m2LbEf31OlNM5XN1xLkqwGDPB0QxqXSC1UM4p3ZdYXgWj

