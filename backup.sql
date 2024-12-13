--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    post_id integer NOT NULL,
    content text NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    parent_id integer
);


ALTER TABLE public.comments OWNER TO neondb_owner;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: game_scores; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.game_scores (
    id integer NOT NULL,
    distance numeric NOT NULL,
    attempts integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.game_scores OWNER TO neondb_owner;

--
-- Name: game_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.game_scores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.game_scores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    author_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    is_moderated boolean DEFAULT false
);


ALTER TABLE public.posts OWNER TO neondb_owner;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.posts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reactions (
    id integer NOT NULL,
    post_id integer NOT NULL,
    emoji text NOT NULL,
    author_id text NOT NULL
);


ALTER TABLE public.reactions OWNER TO neondb_owner;

--
-- Name: reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.reactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: surveys; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.surveys (
    id integer NOT NULL,
    email text NOT NULL,
    budget integer NOT NULL,
    location text NOT NULL,
    transportation text NOT NULL,
    needs_couch_surfing boolean DEFAULT false,
    event_types text[] NOT NULL,
    venue text[] NOT NULL,
    academic_status text NOT NULL,
    availability text[] NOT NULL,
    dietary_restrictions text,
    alcohol_preferences text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.surveys OWNER TO neondb_owner;

--
-- Name: surveys_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.surveys ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.surveys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comments (id, post_id, content, author_id, created_at, parent_id) FROM stdin;
2	3	整！	anon_zzblf	2024-12-13 02:28:46.080922	\N
\.


--
-- Data for Name: game_scores; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.game_scores (id, distance, attempts, created_at) FROM stdin;
3	11.77	1	2024-12-13 02:27:42.451403
4	11.27	2	2024-12-13 02:27:47.087682
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.posts (id, title, content, author_id, created_at, is_moderated) FROM stdin;
3	All Hail SJTUer!!!	今年聚会FDU T恤一定整上：）	anon_bfisu	2024-12-13 02:28:33.551323	f
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reactions (id, post_id, emoji, author_id) FROM stdin;
2	3	🎭	anon_ykhhu
\.


--
-- Data for Name: surveys; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.surveys (id, email, budget, location, transportation, needs_couch_surfing, event_types, venue, academic_status, availability, dietary_restrictions, alcohol_preferences, created_at) FROM stdin;
2	fretin13@gmail.com	50	New York		f	{networking,startup,dating,social,entertainment}	{pubs,restaurants,clubs,airbnb}	working	{"[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]","[object Object]"}	Dairy	none	2024-12-13 02:34:24.090708
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.comments_id_seq', 2, true);


--
-- Name: game_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.game_scores_id_seq', 4, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.posts_id_seq', 3, true);


--
-- Name: reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reactions_id_seq', 2, true);


--
-- Name: surveys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.surveys_id_seq', 2, true);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: game_scores game_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.game_scores
    ADD CONSTRAINT game_scores_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: surveys surveys_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);


--
-- Name: comments comments_post_id_posts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_posts_id_fk FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: reactions reactions_post_id_posts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_post_id_posts_id_fk FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

