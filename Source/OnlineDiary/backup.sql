--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-08-30 02:06:40 CEST

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
-- TOC entry 216 (class 1259 OID 16400)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3454 (class 2604 OID 16403)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3603 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password) FROM stdin;
1	Test	$2a$12$CleyXVMhPl8cfnJIreGkpe.8fuhTba73cez/v2HyfCdV6dTX3CX1u
2	Testo	$2a$12$D3jctg2Pl1ZcDgs7trY8Iu5Ei/z4MZq3GJ8yofWhNMbpLkgcPDrta
\.


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3456 (class 2606 OID 16407)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3458 (class 2606 OID 16409)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


-- Completed on 2024-08-30 02:06:40 CEST

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-08-30 02:06:10 CEST

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
-- TOC entry 218 (class 1259 OID 16411)
-- Name: journals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journals (
    id integer NOT NULL,
    user_id integer,
    date date NOT NULL,
    title character varying,
    content character varying NOT NULL,
    is_public boolean DEFAULT false
);


ALTER TABLE public.journals OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16410)
-- Name: journals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.journals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journals_id_seq OWNER TO postgres;

--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 217
-- Name: journals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.journals_id_seq OWNED BY public.journals.id;


--
-- TOC entry 3454 (class 2604 OID 16414)
-- Name: journals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journals ALTER COLUMN id SET DEFAULT nextval('public.journals_id_seq'::regclass);


--
-- TOC entry 3603 (class 0 OID 16411)
-- Dependencies: 218
-- Data for Name: journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journals (id, user_id, date, title, content, is_public) FROM stdin;
23	1	2024-09-10	Eintrag 2	{"blocks":[{"key":"b342q","text":"Text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
31	1	2024-10-23	Eintrag 3	{"blocks":[{"key":"8emd4","text":"Text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
26	1	2025-01-17	Eintrag 6	{"blocks":[{"key":"5kpd9","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
27	1	2025-02-10	Eintrag 7	{"blocks":[{"key":"btdvg","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
28	1	2025-02-13	Eintrag 8	{"blocks":[{"key":"4js5c","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
29	1	2025-02-18	Eintrag 9	{"blocks":[{"key":"4aon0","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
30	1	2025-03-01	Eintrag 10	{"blocks":[{"key":"23gbv","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
32	1	2024-08-14	Eintrag 11	{"blocks":[{"key":"dkpva","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
33	1	2024-08-06	Eintrag 12	{"blocks":[{"key":"fgstp","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
34	1	2024-08-05	Eintrag 13	{"blocks":[{"key":"cq7fu","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
18	2	2024-08-09	Privat	{"blocks":[{"key":"3nmaq","text":"Ein sehr privater Tag.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	f
35	1	2024-08-04	Eintrag 14	{"blocks":[{"key":"c94f","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
25	1	2024-12-15	Eintrag 5	{"blocks":[{"key":"aabat","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
19	2	2024-08-13	Auch öffentlich	{"blocks":[{"key":"bamf3","text":"Auch ein sehr öffentlicher Tag","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
22	1	2024-08-25	Eintrag 1	{"blocks":[{"key":"7vs5e","text":"Text","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
17	2	2024-08-22	Öffentlich	{"blocks":[{"key":"e89fg","text":"Sehr öffentlicher Tag","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
24	1	2024-11-20	Eintrag 4	{"blocks":[{"key":"b2kaj","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}	t
\.


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 217
-- Name: journals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.journals_id_seq', 37, true);


--
-- TOC entry 3457 (class 2606 OID 16418)
-- Name: journals journals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_pkey PRIMARY KEY (id);


--
-- TOC entry 3458 (class 2606 OID 16419)
-- Name: journals journals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-08-30 02:06:10 CEST

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-08-30 02:06:24 CEST

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
-- TOC entry 222 (class 1259 OID 16464)
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    user_id integer,
    journal_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16463)
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO postgres;

--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 221
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- TOC entry 3454 (class 2604 OID 16467)
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- TOC entry 3606 (class 0 OID 16464)
-- Dependencies: 222
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.likes (id, user_id, journal_id, created_at) FROM stdin;
61	1	19	2024-08-26 22:21:22.190202
62	1	30	2024-08-26 22:44:19.203326
63	1	24	2024-08-26 22:48:52.326164
64	2	19	2024-08-29 00:29:23.793948
66	1	25	2024-08-29 01:35:13.350213
22	2	17	2024-08-24 21:07:18.71371
26	1	\N	2024-08-26 17:10:07.619754
55	1	17	2024-08-26 18:43:27.766417
\.


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 221
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.likes_id_seq', 66, true);


--
-- TOC entry 3457 (class 2606 OID 16470)
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- TOC entry 3459 (class 2606 OID 16472)
-- Name: likes likes_user_id_journal_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_journal_id_key UNIQUE (user_id, journal_id);


--
-- TOC entry 3460 (class 2606 OID 16478)
-- Name: likes likes_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journals(id) ON DELETE CASCADE;


--
-- TOC entry 3461 (class 2606 OID 16473)
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-08-30 02:06:24 CEST

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-08-30 02:04:54 CEST

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
-- TOC entry 220 (class 1259 OID 16426)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    journal_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16425)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 219
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 3454 (class 2604 OID 16429)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3604 (class 0 OID 16426)
-- Dependencies: 220
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, user_id, journal_id, content, created_at) FROM stdin;
1	2	17	Das ist mein Kommentar	2024-08-23 20:17:24.891902
2	1	17	Was ist Testo denn für ein Name 😂	2024-08-23 20:18:36.634762
3	2	19	Geilo	2024-08-24 21:07:43.100706
4	1	24	Erster Kommentar	2024-08-26 18:46:26.572661
5	1	24	Zweiter Kommentar	2024-08-26 18:46:31.902885
6	1	24	Dritter Kommentar	2024-08-26 18:46:37.711665
7	1	24	Vierter Kommentar	2024-08-26 18:46:44.358805
8	1	24	Fünfter Kommentar	2024-08-26 18:46:52.443716
9	1	24	Sechster Kommentar	2024-08-26 18:46:57.735699
10	1	24	Siebter Kommentar	2024-08-26 18:47:05.347212
11	1	24	Achter Kommentar	2024-08-26 18:47:10.56492
12	1	24	Neunter Kommentar	2024-08-26 18:47:18.407737
13	1	24	Zehnter Kommentar	2024-08-26 18:47:29.927294
14	1	24	Elfter Kommentar	2024-08-26 18:47:37.794212
15	1	24	Zwölfter Kommentar	2024-08-26 18:47:46.174214
16	1	24	Ein großer comment.\n.\n.\n.\n.\n.\n.\n\n\n.\n.\n.\n.\n.\n.\n..\n	2024-08-26 22:12:18.90847
17	1	24	Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.	2024-08-26 22:12:52.244129
18	1	25	Hallo :3	2024-08-29 01:35:08.674944
\.


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 219
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 18, true);


--
-- TOC entry 3457 (class 2606 OID 16434)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3458 (class 2606 OID 16440)
-- Name: comments comments_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journals(id) ON DELETE CASCADE;


--
-- TOC entry 3459 (class 2606 OID 16435)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2024-08-30 02:04:54 CEST

--
-- PostgreSQL database dump complete
--

ADD COLUMN edited BOOLEAN DEFAULT FALSE;
ALTER TABLE

ALTER TABLE comments
ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
