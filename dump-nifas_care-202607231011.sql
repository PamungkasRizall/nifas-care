--
-- PostgreSQL database dump
--

\restrict q4JaB1iiPn3WaF57EgSmBpOGZ6s55dILPgNqpbrqer4bhdVNbZohLEJRP2fBJOm

-- Dumped from database version 13.4
-- Dumped by pg_dump version 18.4 (Homebrew)

-- Started on 2026-07-23 10:11:06 WIB

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

DROP DATABASE nifas_care;
--
-- TOC entry 3574 (class 1262 OID 70421)
-- Name: nifas_care; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE nifas_care WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


\unrestrict q4JaB1iiPn3WaF57EgSmBpOGZ6s55dILPgNqpbrqer4bhdVNbZohLEJRP2fBJOm
\connect nifas_care
\restrict q4JaB1iiPn3WaF57EgSmBpOGZ6s55dILPgNqpbrqer4bhdVNbZohLEJRP2fBJOm

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
-- TOC entry 5 (class 2615 OID 75845)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 661 (class 1247 OID 75882)
-- Name: AssessmentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AssessmentStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'REJECTED',
    'COMPLETED'
);


--
-- TOC entry 658 (class 1247 OID 75876)
-- Name: AssessmentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AssessmentType" AS ENUM (
    'EPDS',
    'MAGNESIUM'
);


--
-- TOC entry 670 (class 1247 OID 75908)
-- Name: AssignmentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AssignmentStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'SUBMITTED',
    'COMPLETED',
    'OVERDUE'
);


--
-- TOC entry 673 (class 1247 OID 75920)
-- Name: InterventionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InterventionType" AS ENUM (
    'COUNSELING',
    'EDUCATION',
    'REFERRAL',
    'HOME_VISIT',
    'PSYCHOTHERAPY'
);


--
-- TOC entry 676 (class 1247 OID 75932)
-- Name: NotificationChannelType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationChannelType" AS ENUM (
    'IN_APP',
    'EMAIL'
);


--
-- TOC entry 679 (class 1247 OID 75938)
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'UNREAD',
    'READ',
    'ARCHIVED'
);


--
-- TOC entry 664 (class 1247 OID 75894)
-- Name: ReviewStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ReviewStatus" AS ENUM (
    'APPROVED',
    'REJECTED'
);


--
-- TOC entry 649 (class 1247 OID 75847)
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'MIDWIFE',
    'NUTRITIONIST',
    'MOTHER',
    'RESEARCHER'
);


--
-- TOC entry 667 (class 1247 OID 75900)
-- Name: ScheduleTriggerType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ScheduleTriggerType" AS ENUM (
    'POSTPARTUM_DAY',
    'POSTPARTUM_WEEK',
    'CUSTOM'
);


--
-- TOC entry 652 (class 1247 OID 75860)
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserStatus" AS ENUM (
    'PENDING_ONBOARDING',
    'PENDING_MIDWIFE_REVIEW',
    'ACTIVE',
    'SUSPENDED'
);


--
-- TOC entry 655 (class 1247 OID 75870)
-- Name: VerificationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VerificationStatus" AS ENUM (
    'APPROVED',
    'RETURNED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 75956)
-- Name: Account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- TOC entry 206 (class 1259 OID 76004)
-- Name: Assessment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Assessment" (
    id text NOT NULL,
    "motherId" text NOT NULL,
    "assignmentId" text,
    type public."AssessmentType" NOT NULL,
    status public."AssessmentStatus" DEFAULT 'DRAFT'::public."AssessmentStatus" NOT NULL,
    answers jsonb,
    "submittedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 76112)
-- Name: AssessmentInterpretation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentInterpretation" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "minScore" integer NOT NULL,
    "maxScore" integer NOT NULL,
    interpretation text NOT NULL,
    priority text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 76103)
-- Name: AssessmentOption; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentOption" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    label text NOT NULL,
    score integer NOT NULL,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 76092)
-- Name: AssessmentQuestion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentQuestion" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    code text NOT NULL,
    "order" integer NOT NULL,
    title text NOT NULL,
    required boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 76014)
-- Name: AssessmentReview; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentReview" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "reviewerId" text NOT NULL,
    "reviewerRole" public."Role" NOT NULL,
    status public."ReviewStatus" NOT NULL,
    note text,
    decision text,
    "followUpDate" timestamp(3) without time zone,
    "followUpNote" text,
    "reviewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 210 (class 1259 OID 76044)
-- Name: AssessmentSchedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentSchedule" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "triggerType" public."ScheduleTriggerType" NOT NULL,
    "triggerValue" integer NOT NULL,
    sequence integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 76033)
-- Name: AssessmentTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssessmentTemplate" (
    id text NOT NULL,
    code public."AssessmentType" NOT NULL,
    name text NOT NULL,
    description text,
    version text DEFAULT '1.0'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 76082)
-- Name: Assignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Assignment" (
    id text NOT NULL,
    "motherId" text NOT NULL,
    type public."AssessmentType" NOT NULL,
    title text NOT NULL,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status public."AssignmentStatus" DEFAULT 'PENDING'::public."AssignmentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 76130)
-- Name: ClinicalDecisionRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicalDecisionRule" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    priority text NOT NULL,
    decision text NOT NULL,
    interventions text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 208 (class 1259 OID 76024)
-- Name: ClinicalIntervention; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClinicalIntervention" (
    id text NOT NULL,
    "assessmentReviewId" text NOT NULL,
    type public."InterventionType" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 76196)
-- Name: DailyMood; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DailyMood" (
    id text NOT NULL,
    "motherId" text NOT NULL,
    score integer NOT NULL,
    emoji text NOT NULL,
    label text NOT NULL,
    note text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 76139)
-- Name: FollowUpRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FollowUpRule" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    priority text NOT NULL,
    days integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 76157)
-- Name: Food; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Food" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 76148)
-- Name: FoodCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FoodCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 76167)
-- Name: FoodServing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FoodServing" (
    id text NOT NULL,
    "foodId" text NOT NULL,
    name text NOT NULL,
    weight double precision NOT NULL,
    magnesium double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 76187)
-- Name: MagnesiumInterpretationRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MagnesiumInterpretationRule" (
    id text NOT NULL,
    "minPercent" double precision NOT NULL,
    "maxPercent" double precision NOT NULL,
    status text NOT NULL,
    interpretation text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 76176)
-- Name: MagnesiumTarget; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MagnesiumTarget" (
    id text NOT NULL,
    target double precision DEFAULT 360 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 75978)
-- Name: MotherProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MotherProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fullName" text,
    "phoneNumber" text,
    "dateOfBirth" timestamp(3) without time zone,
    education text,
    occupation text,
    address text,
    "deliveryDate" timestamp(3) without time zone,
    "deliveryMethod" text,
    gravida integer,
    parity integer,
    abortus integer,
    "babyName" text,
    "babyGender" text,
    "birthWeight" double precision,
    "birthLength" double precision,
    hypertension boolean DEFAULT false NOT NULL,
    diabetes boolean DEFAULT false NOT NULL,
    "preEclampsia" boolean DEFAULT false NOT NULL,
    "anxietyDisorder" boolean DEFAULT false NOT NULL,
    "depressionHistory" boolean DEFAULT false NOT NULL,
    "emergencyContactName" text,
    "emergencyContactRelationship" text,
    "emergencyContactPhone" text,
    "privacyPolicyConsent" boolean DEFAULT false NOT NULL,
    "dataProcessingConsent" boolean DEFAULT false NOT NULL,
    "researchParticipationConsent" boolean DEFAULT false NOT NULL,
    "midwifeNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 76072)
-- Name: Notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    event text NOT NULL,
    "recipientId" text NOT NULL,
    "recipientRole" public."Role" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    channel public."NotificationChannelType" NOT NULL,
    status public."NotificationStatus" DEFAULT 'UNREAD'::public."NotificationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


--
-- TOC entry 205 (class 1259 OID 75995)
-- Name: OnboardingVerification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OnboardingVerification" (
    id text NOT NULL,
    "motherUserId" text NOT NULL,
    "midwifeUserId" text NOT NULL,
    status public."VerificationStatus" NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 76121)
-- Name: RedFlagRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RedFlagRule" (
    id text NOT NULL,
    "templateId" text NOT NULL,
    "questionCode" text NOT NULL,
    "triggerScore" integer NOT NULL,
    "overridePriority" text NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 76063)
-- Name: ReminderHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReminderHistory" (
    id text NOT NULL,
    "ruleId" text NOT NULL,
    "recipientId" text NOT NULL,
    "assessmentId" text,
    "triggeredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 76054)
-- Name: ReminderRule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReminderRule" (
    id text NOT NULL,
    code text NOT NULL,
    trigger text NOT NULL,
    "offset" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- TOC entry 202 (class 1259 OID 75964)
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 200 (class 1259 OID 75945)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    password text,
    role public."Role" DEFAULT 'MOTHER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."UserStatus" DEFAULT 'PENDING_ONBOARDING'::public."UserStatus" NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 75972)
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 3543 (class 0 OID 75956)
-- Dependencies: 201
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Account" VALUES ('cmrkp56i10029vspsyvq6u6gf', 'cmrkp564e0028vspst7tgp1tc', 'oidc', 'google', '113563701954473248628', NULL, 'ya29.a0AT3oNZ9KuYXnCbsKDKL6dGdC8U7GAy6IAXot7VfNuIEn8PGAuLiJveJMUEzdUjCXeyTYJFF25qOtuYz17U4v0Z2MYuOB7S1upcaVFRY9ygolmh6iPQ0fL7hXtMrASsARp5zvmE-aQ1oIgCuDfgcW42TRzaX737wloYlfFY2ZSlrrxR0uif4e6VxksVUbWdvToAwF1wj8HKyFjFpOmdoC381ULod4AXekPFwv8xdxaQCm9X4AAebsHYyE7tgPzbTiDwCm8tYUuosd8mTmLgtlQ0Ho8WbzaCgYKAawSARUSFQHGX2Mi3H0CCitxn9dUvUgrAduLPg0291', 1784039886, 'bearer', 'https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJjOGY3YWY1OGRiNDRjZjZlYWEyZWQxMGVjODBmMzQwOGNmZGU0NjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNTEwMzk5OTMxMTktazkzZTM1NXRzc3A0MWlqZDgya3U0czhkaWg0dG5yaHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNTEwMzk5OTMxMTktazkzZTM1NXRzc3A0MWlqZDgya3U0czhkaWg0dG5yaHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM1NjM3MDE5NTQ0NzMyNDg2MjgiLCJlbWFpbCI6ImdhZG9nLnRvbGlzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZWI2UV8wb3E1OXpuXzA2VGVJLVU4dyIsIm5hbWUiOiJHYSB0b2xpcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJNHNPZWYtRFBteWU1cF95Q2pSV01ZdmM0bHVtM1lxckVUbU9OYy1HYUhleklESENydz1zOTYtYyIsImdpdmVuX25hbWUiOiJHYSIsImZhbWlseV9uYW1lIjoidG9saXMiLCJpYXQiOjE3ODQwMzYyODgsImV4cCI6MTc4NDAzOTg4OH0.n5haLtEv4W_hdXR-ggwmZb5Lf5_6nqJ6-A4nGOvE3SGaPXOZnFhbeW3TL3yf2-xNgqn5bIXbCAUNPqomAqv3YV3gpgS5sm7rHdvP0X1DV0P3h665Hp1nWU-DkDlwyPPrFySE1rfE8rcmQ_CrnHaPsY03B8ZjDRjVfa91EWr1MuGZqYQ524NT83NReffM-2bpOud5Gf-uXyen6vurYyCMG33G7S7-zyMyvdfoNDrKLao7HdBYv-n3LfEvwTze1_dpOKvotgMzlWpTYAV6iVGZOXV3rgxpaTbJEc04teGrt08pGtme8W6X2TZPS0Xof6diXSDGwfQCm8t9Mu9k-9XtXg', NULL);


--
-- TOC entry 3548 (class 0 OID 76004)
-- Dependencies: 206
-- Data for Name: Assessment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3559 (class 0 OID 76112)
-- Dependencies: 217
-- Data for Name: AssessmentInterpretation; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AssessmentInterpretation" VALUES ('cmrkp0vf8001o11pswwq8edzj', 'cmrkp0vby000611ps6m3k26eo', 0, 9, 'Normal', 'LOW', '2026-07-14 13:34:47.828', '2026-07-14 13:34:47.828');
INSERT INTO public."AssessmentInterpretation" VALUES ('cmrkp0vfa001p11psh8xjov52', 'cmrkp0vby000611ps6m3k26eo', 10, 12, 'Risiko Depresi', 'HIGH', '2026-07-14 13:34:47.83', '2026-07-14 13:34:47.83');
INSERT INTO public."AssessmentInterpretation" VALUES ('cmrkp0vfb001q11pskq4yna16', 'cmrkp0vby000611ps6m3k26eo', 13, 30, 'Probable Depression', 'HIGH', '2026-07-14 13:34:47.831', '2026-07-14 13:34:47.831');


--
-- TOC entry 3558 (class 0 OID 76103)
-- Dependencies: 216
-- Data for Name: AssessmentOption; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vd4000b11ps33l0tzy2', 'cmrkp0vcs000a11ps0g66d6o0', 'Sama seperti biasanya', 0, 1, '2026-07-14 13:34:47.752', '2026-07-14 13:34:47.752');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vd7000c11psz4v08nr6', 'cmrkp0vcs000a11ps0g66d6o0', 'Tidak begitu banyak sekarang', 1, 2, '2026-07-14 13:34:47.755', '2026-07-14 13:34:47.755');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vd8000d11psedvvfhfj', 'cmrkp0vcs000a11ps0g66d6o0', 'Jelas kurang banyak sekarang', 2, 3, '2026-07-14 13:34:47.756', '2026-07-14 13:34:47.756');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vd9000e11psn2wilv1u', 'cmrkp0vcs000a11ps0g66d6o0', 'Tidak bisa sama sekali', 3, 4, '2026-07-14 13:34:47.757', '2026-07-14 13:34:47.757');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdc000g11pso45fm9za', 'cmrkp0vda000f11psw09360z6', 'Sama seperti biasanya', 0, 1, '2026-07-14 13:34:47.76', '2026-07-14 13:34:47.76');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vde000h11pscw358cb7', 'cmrkp0vda000f11psw09360z6', 'Agak kurang dari biasanya', 1, 2, '2026-07-14 13:34:47.762', '2026-07-14 13:34:47.762');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdf000i11psh3ucfvhx', 'cmrkp0vda000f11psw09360z6', 'Jelas kurang dari biasanya', 2, 3, '2026-07-14 13:34:47.763', '2026-07-14 13:34:47.763');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdg000j11psxvtddltv', 'cmrkp0vda000f11psw09360z6', 'Hampir tidak bisa sama sekali', 3, 4, '2026-07-14 13:34:47.764', '2026-07-14 13:34:47.764');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdj000l11psnvsqyv3l', 'cmrkp0vdh000k11psxsem6qc2', 'Ya, hampir sepanjang waktu', 3, 1, '2026-07-14 13:34:47.767', '2026-07-14 13:34:47.767');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdl000m11psf1p4uqci', 'cmrkp0vdh000k11psxsem6qc2', 'Ya, kadang-kadang', 2, 2, '2026-07-14 13:34:47.769', '2026-07-14 13:34:47.769');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdm000n11psbh8yqle0', 'cmrkp0vdh000k11psxsem6qc2', 'Tidak terlalu sering', 1, 3, '2026-07-14 13:34:47.77', '2026-07-14 13:34:47.77');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdn000o11psyp6gpzsn', 'cmrkp0vdh000k11psxsem6qc2', 'Tidak pernah', 0, 4, '2026-07-14 13:34:47.771', '2026-07-14 13:34:47.771');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdq000q11psmkm2zfdp', 'cmrkp0vdo000p11ps0yufzawm', 'Tidak, tidak sama sekali', 0, 1, '2026-07-14 13:34:47.774', '2026-07-14 13:34:47.774');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdr000r11ps5kh16ibz', 'cmrkp0vdo000p11ps0yufzawm', 'Hampir tidak pernah', 1, 2, '2026-07-14 13:34:47.775', '2026-07-14 13:34:47.775');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdt000s11psz3p5d3co', 'cmrkp0vdo000p11ps0yufzawm', 'Ya, kadang-kadang', 2, 3, '2026-07-14 13:34:47.777', '2026-07-14 13:34:47.777');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdu000t11psgxdr3eyh', 'cmrkp0vdo000p11ps0yufzawm', 'Ya, sangat sering', 3, 4, '2026-07-14 13:34:47.778', '2026-07-14 13:34:47.778');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vdy000v11ps8239b132', 'cmrkp0vdw000u11ps0pax25ys', 'Ya, cukup banyak', 3, 1, '2026-07-14 13:34:47.782', '2026-07-14 13:34:47.782');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ve1000w11ps3loyo1p1', 'cmrkp0vdw000u11ps0pax25ys', 'Ya, kadang-kadang', 2, 2, '2026-07-14 13:34:47.785', '2026-07-14 13:34:47.785');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ve3000x11ps2b1owiw9', 'cmrkp0vdw000u11ps0pax25ys', 'Tidak, tidak terlalu banyak', 1, 3, '2026-07-14 13:34:47.787', '2026-07-14 13:34:47.787');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ve4000y11ps0r5oi2dk', 'cmrkp0vdw000u11ps0pax25ys', 'Tidak, tidak sama sekali', 0, 4, '2026-07-14 13:34:47.788', '2026-07-14 13:34:47.788');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ve7001011ps1blpl2qx', 'cmrkp0ve5000z11psitwbsdzx', 'Ya, sebagian besar waktu saya tidak mampu mengatasinya sama sekali', 3, 1, '2026-07-14 13:34:47.791', '2026-07-14 13:34:47.791');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ve9001111psrodp0pmf', 'cmrkp0ve5000z11psitwbsdzx', 'Ya, kadang-kadang saya tidak mampu mengatasi seperti biasanya', 2, 2, '2026-07-14 13:34:47.793', '2026-07-14 13:34:47.793');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vea001211ps9kxqbsii', 'cmrkp0ve5000z11psitwbsdzx', 'Tidak, sebagian besar waktu saya dapat mengatasi dengan cukup baik', 1, 3, '2026-07-14 13:34:47.794', '2026-07-14 13:34:47.794');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0veb001311ps7716m0ze', 'cmrkp0ve5000z11psitwbsdzx', 'Tidak, saya dapat mengatasi masalah seperti biasanya', 0, 4, '2026-07-14 13:34:47.795', '2026-07-14 13:34:47.795');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vee001511psdfzisqvb', 'cmrkp0vec001411pskyl50wnu', 'Ya, hampir sepanjang waktu', 3, 1, '2026-07-14 13:34:47.798', '2026-07-14 13:34:47.798');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vei001611ps2kncbop0', 'cmrkp0vec001411pskyl50wnu', 'Ya, kadang-kadang', 2, 2, '2026-07-14 13:34:47.802', '2026-07-14 13:34:47.802');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vek001711pslzpxtmlz', 'cmrkp0vec001411pskyl50wnu', 'Tidak terlalu sering', 1, 3, '2026-07-14 13:34:47.804', '2026-07-14 13:34:47.804');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vel001811psuvtqwyaq', 'cmrkp0vec001411pskyl50wnu', 'Tidak, tidak sama sekali', 0, 4, '2026-07-14 13:34:47.805', '2026-07-14 13:34:47.805');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vep001a11ps4yiq5aga', 'cmrkp0vem001911psa4ul1od7', 'Ya, hampir sepanjang waktu', 3, 1, '2026-07-14 13:34:47.809', '2026-07-14 13:34:47.809');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0veq001b11psjd5dxhyk', 'cmrkp0vem001911psa4ul1od7', 'Ya, cukup sering', 2, 2, '2026-07-14 13:34:47.81', '2026-07-14 13:34:47.81');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ver001c11psgu1ewu70', 'cmrkp0vem001911psa4ul1od7', 'Tidak terlalu sering', 1, 3, '2026-07-14 13:34:47.811', '2026-07-14 13:34:47.811');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0ves001d11ps0qxbelrp', 'cmrkp0vem001911psa4ul1od7', 'Tidak, tidak sama sekali', 0, 4, '2026-07-14 13:34:47.812', '2026-07-14 13:34:47.812');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vev001f11psj0vhwcjx', 'cmrkp0veu001e11ps3ag0lp52', 'Ya, hampir sepanjang waktu', 3, 1, '2026-07-14 13:34:47.815', '2026-07-14 13:34:47.815');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vew001g11psc90cig1s', 'cmrkp0veu001e11ps3ag0lp52', 'Ya, cukup sering', 2, 2, '2026-07-14 13:34:47.816', '2026-07-14 13:34:47.816');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vey001h11psvjk23m76', 'cmrkp0veu001e11ps3ag0lp52', 'Hanya kadang-kadang', 1, 3, '2026-07-14 13:34:47.818', '2026-07-14 13:34:47.818');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vez001i11psw2smbyzf', 'cmrkp0veu001e11ps3ag0lp52', 'Tidak, tidak pernah', 0, 4, '2026-07-14 13:34:47.819', '2026-07-14 13:34:47.819');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vf2001k11pszvkj72jc', 'cmrkp0vf0001j11ps73skg3kr', 'Ya, cukup sering', 3, 1, '2026-07-14 13:34:47.822', '2026-07-14 13:34:47.822');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vf3001l11pskr18cw8e', 'cmrkp0vf0001j11ps73skg3kr', 'Kadang-kadang', 2, 2, '2026-07-14 13:34:47.823', '2026-07-14 13:34:47.823');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vf4001m11ps7ymwqlnq', 'cmrkp0vf0001j11ps73skg3kr', 'Hampir tidak pernah', 1, 3, '2026-07-14 13:34:47.824', '2026-07-14 13:34:47.824');
INSERT INTO public."AssessmentOption" VALUES ('cmrkp0vf5001n11ps9jctriu6', 'cmrkp0vf0001j11ps73skg3kr', 'Tidak pernah', 0, 4, '2026-07-14 13:34:47.826', '2026-07-14 13:34:47.826');


--
-- TOC entry 3557 (class 0 OID 76092)
-- Dependencies: 215
-- Data for Name: AssessmentQuestion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vcs000a11ps0g66d6o0', 'cmrkp0vby000611ps6m3k26eo', 'epds_q1', 1, 'Saya mampu tertawa dan melihat sisi menyenangkan dari berbagai hal:', true, true, '2026-07-14 13:34:47.74', '2026-07-14 13:34:47.74');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vda000f11psw09360z6', 'cmrkp0vby000611ps6m3k26eo', 'epds_q2', 2, 'Saya memandang ke depan dengan rasa senang terhadap berbagai hal:', true, true, '2026-07-14 13:34:47.758', '2026-07-14 13:34:47.758');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vdh000k11psxsem6qc2', 'cmrkp0vby000611ps6m3k26eo', 'epds_q3', 3, 'Saya menyalahkan diri sendiri secara tidak perlu ketika ada hal yang salah:', true, true, '2026-07-14 13:34:47.765', '2026-07-14 13:34:47.765');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vdo000p11ps0yufzawm', 'cmrkp0vby000611ps6m3k26eo', 'epds_q4', 4, 'Saya merasa cemas atau khawatir tanpa alasan yang jelas:', true, true, '2026-07-14 13:34:47.772', '2026-07-14 13:34:47.772');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vdw000u11ps0pax25ys', 'cmrkp0vby000611ps6m3k26eo', 'epds_q5', 5, 'Saya merasa takut atau panik tanpa alasan yang sangat jelas:', true, true, '2026-07-14 13:34:47.78', '2026-07-14 13:34:47.78');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0ve5000z11psitwbsdzx', 'cmrkp0vby000611ps6m3k26eo', 'epds_q6', 6, 'Banyak hal yang menumpuk dan membuat saya merasa tidak mampu mengatasinya:', true, true, '2026-07-14 13:34:47.789', '2026-07-14 13:34:47.789');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vec001411pskyl50wnu', 'cmrkp0vby000611ps6m3k26eo', 'epds_q7', 7, 'Saya merasa tidak bahagia sehingga saya mengalami kesulitan untuk tidur:', true, true, '2026-07-14 13:34:47.796', '2026-07-14 13:34:47.796');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vem001911psa4ul1od7', 'cmrkp0vby000611ps6m3k26eo', 'epds_q8', 8, 'Saya merasa sedih atau sengsara:', true, true, '2026-07-14 13:34:47.806', '2026-07-14 13:34:47.806');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0veu001e11ps3ag0lp52', 'cmrkp0vby000611ps6m3k26eo', 'epds_q9', 9, 'Saya merasa sangat tidak bahagia sehingga saya menangis:', true, true, '2026-07-14 13:34:47.814', '2026-07-14 13:34:47.814');
INSERT INTO public."AssessmentQuestion" VALUES ('cmrkp0vf0001j11ps73skg3kr', 'cmrkp0vby000611ps6m3k26eo', 'epds_q10', 10, 'Pikiran untuk mencelakakan diri sendiri pernah terpikir oleh saya:', true, true, '2026-07-14 13:34:47.82', '2026-07-14 13:34:47.82');


--
-- TOC entry 3549 (class 0 OID 76014)
-- Dependencies: 207
-- Data for Name: AssessmentReview; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3552 (class 0 OID 76044)
-- Dependencies: 210
-- Data for Name: AssessmentSchedule; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp0vcb000711ps5aw11zhs', 'cmrkp0vby000611ps6m3k26eo', 'POSTPARTUM_DAY', 14, 1, true, '2026-07-14 13:34:47.723', '2026-07-14 13:34:47.723');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp0vch000811psv4jyj9wc', 'cmrkp0vby000611ps6m3k26eo', 'POSTPARTUM_DAY', 28, 2, true, '2026-07-14 13:34:47.729', '2026-07-14 13:34:47.729');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp0vck000911pscynmmp6h', 'cmrkp0vby000611ps6m3k26eo', 'POSTPARTUM_DAY', 42, 3, true, '2026-07-14 13:34:47.732', '2026-07-14 13:34:47.732');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpdqal0001z11pspo4o6gg1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 1, 1, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpmgbn0002z11pspo48xgw1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 2, 2, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpzr700003z11pspo494st1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 3, 3, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpknsq0004z11pspo4qp301h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 4, 4, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpxl120005z11pspo4puhk1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 5, 5, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp3u2x0006z11pspo4q2i91h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 6, 6, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpo8ou0007z11pspo4gon31h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 7, 7, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpcm3b0008z11pspo4elga1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 8, 8, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp327b0009z11pspo4z0wn1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 9, 9, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp5cu40010z11pspo4ato71h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 10, 10, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpjt4l0011z11pspo47bn61h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 11, 11, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpdrd80012z11pspo4tahm1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 12, 12, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp8yt70013z11pspo4zzuj1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 13, 13, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpnuur0014z11pspo493sf1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 14, 14, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpb6u30015z11pspo4qcuj1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 15, 15, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp2vif0016z11pspo4d7p61h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 16, 16, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkprwx80017z11pspo49z4p1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 17, 17, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp70d00018z11pspo4jse81h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 18, 18, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp6p5x0019z11pspo4doyx1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 19, 19, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpuwoh0020z11pspo4eg4q1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 20, 20, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpwroo0021z11pspo432d51h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 21, 21, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpks0y0022z11pspo440l61h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 22, 22, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpsduo0023z11pspo4pvem1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 23, 23, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpv2750024z11pspo406o41h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 24, 24, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkphtmd0025z11pspo4tf371h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 25, 25, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp8lot0026z11pspo4acud1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 26, 26, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpk3je0027z11pspo404341h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 27, 27, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkphezu0028z11pspo4infi1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 28, 28, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpg7gd0029z11pspo4vfel1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 29, 29, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp6s6v0030z11pspo4jsh01h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 30, 30, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp8q120031z11pspo4wtu21h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 31, 31, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpf9e40032z11pspo4ohlh1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 32, 32, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkppqjq0033z11pspo4f3r51h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 33, 33, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpu3nr0034z11pspo4aayt1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 34, 34, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpnkec0035z11pspo480o31h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 35, 35, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp5ws00036z11pspo4f2qt1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 36, 36, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp4fsn0037z11pspo447cr1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 37, 37, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpzxdr0038z11pspo44v171h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 38, 38, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpwjhg0039z11pspo4i6fk1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 39, 39, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpzknp0040z11pspo4m4ti1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 40, 40, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkpdh8u0041z11pspo47iq81h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 41, 41, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');
INSERT INTO public."AssessmentSchedule" VALUES ('cmrkp1z9q0042z11pspo4rv3b1h3', 'cmrkp0vfy001y11psp952hmtb', 'POSTPARTUM_DAY', 42, 42, true, '2026-07-14 13:34:47.857', '2026-07-14 13:34:47.857');


--
-- TOC entry 3551 (class 0 OID 76033)
-- Dependencies: 209
-- Data for Name: AssessmentTemplate; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AssessmentTemplate" VALUES ('cmrkp0vby000611ps6m3k26eo', 'EPDS', 'Edinburgh Postnatal Depression Scale (EPDS)', 'Skrining kesehatan mental dan kecemasan ibu postpartum.', '1.0', true, '2026-07-14 13:34:47.71', '2026-07-14 13:34:47.71');
INSERT INTO public."AssessmentTemplate" VALUES ('cmrkp0vfy001y11psp952hmtb', 'MAGNESIUM', 'Skrining Asupan Magnesium Harian', 'Skrining asupan gizi magnesium harian bagi Ibu postpartum.', '1.0', true, '2026-07-14 13:34:47.854', '2026-07-14 13:34:47.854');


--
-- TOC entry 3556 (class 0 OID 76082)
-- Dependencies: 214
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3561 (class 0 OID 76130)
-- Dependencies: 219
-- Data for Name: ClinicalDecisionRule; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ClinicalDecisionRule" VALUES ('cmrkp0vfk001s11psn5fe5yqh', 'cmrkp0vby000611ps6m3k26eo', 'LOW', 'Observasi', '{EDUCATION}', '2026-07-14 13:34:47.84', '2026-07-14 13:34:47.84');
INSERT INTO public."ClinicalDecisionRule" VALUES ('cmrkp0vfn001t11psqioulk9t', 'cmrkp0vby000611ps6m3k26eo', 'HIGH', 'Konseling Bidan → Review Dokter', '{COUNSELING,HOME_VISIT}', '2026-07-14 13:34:47.843', '2026-07-14 13:34:47.843');
INSERT INTO public."ClinicalDecisionRule" VALUES ('cmrkp0vfq001u11ps5uiyyyr0', 'cmrkp0vby000611ps6m3k26eo', 'URGENT', 'Review Dokter Segera', '{REFERRAL,PSYCHOTHERAPY}', '2026-07-14 13:34:47.846', '2026-07-14 13:34:47.846');


--
-- TOC entry 3550 (class 0 OID 76024)
-- Dependencies: 208
-- Data for Name: ClinicalIntervention; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3568 (class 0 OID 76196)
-- Dependencies: 226
-- Data for Name: DailyMood; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."DailyMood" VALUES ('cmrkpevod00007epsgl3fxohl', 'cmrkp564e0028vspst7tgp1tc', 5, '😄', 'Sangat Bahagia', 'sangat bahagia dong', '2026-07-13 17:00:00', '2026-07-14 13:45:41.343', '2026-07-14 13:45:41.343');


--
-- TOC entry 3562 (class 0 OID 76139)
-- Dependencies: 220
-- Data for Name: FollowUpRule; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."FollowUpRule" VALUES ('cmrkp0vfs001v11pspqht3k3l', 'cmrkp0vby000611ps6m3k26eo', 'LOW', 14, '2026-07-14 13:34:47.848', '2026-07-14 13:34:47.848');
INSERT INTO public."FollowUpRule" VALUES ('cmrkp0vfu001w11psd9aq6cdp', 'cmrkp0vby000611ps6m3k26eo', 'HIGH', 7, '2026-07-14 13:34:47.85', '2026-07-14 13:34:47.85');
INSERT INTO public."FollowUpRule" VALUES ('cmrkp0vfv001x11psq8txkqbf', 'cmrkp0vby000611ps6m3k26eo', 'URGENT', 1, '2026-07-14 13:34:47.851', '2026-07-14 13:34:47.851');


--
-- TOC entry 3564 (class 0 OID 76157)
-- Dependencies: 222
-- Data for Name: Food; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Food" VALUES ('cmrkp0vgx002c11psq4jrp6z0', 'cmrkp0vg6002111psssz5cfeb', 'Bayam', NULL, true, '2026-07-14 13:34:47.889', '2026-07-14 13:34:47.889');
INSERT INTO public."Food" VALUES ('cmrkp0vh6002f11pstt2j0hlv', 'cmrkp0vg6002111psssz5cfeb', 'Kangkung', NULL, true, '2026-07-14 13:34:47.898', '2026-07-14 13:34:47.898');
INSERT INTO public."Food" VALUES ('cmrkp0vh9002h11ps4wxp1jv0', 'cmrkp0vg6002111psssz5cfeb', 'Brokoli', NULL, true, '2026-07-14 13:34:47.901', '2026-07-14 13:34:47.901');
INSERT INTO public."Food" VALUES ('cmrkp0vhc002j11psynq5pohj', 'cmrkp0vg9002211psncf9bu6w', 'Kedelai', NULL, true, '2026-07-14 13:34:47.904', '2026-07-14 13:34:47.904');
INSERT INTO public."Food" VALUES ('cmrkp0vhh002m11psecglg9tz', 'cmrkp0vg9002211psncf9bu6w', 'Almond', NULL, true, '2026-07-14 13:34:47.909', '2026-07-14 13:34:47.909');
INSERT INTO public."Food" VALUES ('cmrkp0vhm002p11psldcdaaqx', 'cmrkp0vgc002311ps25zr2rw0', 'Biji Labu', NULL, true, '2026-07-14 13:34:47.914', '2026-07-14 13:34:47.914');
INSERT INTO public."Food" VALUES ('cmrkp0vhr002r11psnguh4xbr', 'cmrkp0vgc002311ps25zr2rw0', 'Oatmeal', NULL, true, '2026-07-14 13:34:47.919', '2026-07-14 13:34:47.919');


--
-- TOC entry 3563 (class 0 OID 76148)
-- Dependencies: 221
-- Data for Name: FoodCategory; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."FoodCategory" VALUES ('cmrkp0vg6002111psssz5cfeb', 'Sayuran', '2026-07-14 13:34:47.862', '2026-07-14 13:34:47.862');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vg9002211psncf9bu6w', 'Kacang-kacangan', '2026-07-14 13:34:47.865', '2026-07-14 13:34:47.865');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgc002311ps25zr2rw0', 'Biji-bijian', '2026-07-14 13:34:47.868', '2026-07-14 13:34:47.868');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgf002411psrcfrq74y', 'Buah', '2026-07-14 13:34:47.871', '2026-07-14 13:34:47.871');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgh002511ps1twjudvx', 'Seafood', '2026-07-14 13:34:47.873', '2026-07-14 13:34:47.873');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgk002611ps5w9nh5tu', 'Ikan', '2026-07-14 13:34:47.876', '2026-07-14 13:34:47.876');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgm002711psp6dricu6', 'Daging', '2026-07-14 13:34:47.878', '2026-07-14 13:34:47.878');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgo002811pssbhyr9lc', 'Telur', '2026-07-14 13:34:47.88', '2026-07-14 13:34:47.88');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgq002911ps9bke81to', 'Susu dan Produk Olahan', '2026-07-14 13:34:47.882', '2026-07-14 13:34:47.882');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgt002a11pslkev3qgl', 'Minuman', '2026-07-14 13:34:47.885', '2026-07-14 13:34:47.885');
INSERT INTO public."FoodCategory" VALUES ('cmrkp0vgv002b11ps2xw8fyhs', 'Lainnya', '2026-07-14 13:34:47.887', '2026-07-14 13:34:47.887');


--
-- TOC entry 3565 (class 0 OID 76167)
-- Dependencies: 223
-- Data for Name: FoodServing; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."FoodServing" VALUES ('cmrkp0vh0002d11ps895hram3', 'cmrkp0vgx002c11psq4jrp6z0', '1 Mangkok (180 g)', 180, 142, '2026-07-14 13:34:47.892', '2026-07-14 13:34:47.892');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vh4002e11ps6gt1kvy3', 'cmrkp0vgx002c11psq4jrp6z0', '100 g', 100, 79, '2026-07-14 13:34:47.896', '2026-07-14 13:34:47.896');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vh7002g11psltn1hun9', 'cmrkp0vh6002f11pstt2j0hlv', '1 Piring (100 g)', 100, 79, '2026-07-14 13:34:47.899', '2026-07-14 13:34:47.899');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhb002i11psrl3zfcyl', 'cmrkp0vh9002h11ps4wxp1jv0', '1 Mangkok (150 g)', 150, 33, '2026-07-14 13:34:47.903', '2026-07-14 13:34:47.903');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhf002k11psuys8kwoy', 'cmrkp0vhc002j11psynq5pohj', '100 g rebus', 100, 86, '2026-07-14 13:34:47.907', '2026-07-14 13:34:47.907');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhg002l11psjk0f6sl3', 'cmrkp0vhc002j11psynq5pohj', '50 g rebus', 50, 43, '2026-07-14 13:34:47.908', '2026-07-14 13:34:47.908');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhj002n11ps7ptv1lyq', 'cmrkp0vhh002m11psecglg9tz', '30 g', 30, 80, '2026-07-14 13:34:47.911', '2026-07-14 13:34:47.911');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhl002o11psvhs0pyz3', 'cmrkp0vhh002m11psecglg9tz', '100 g', 100, 268, '2026-07-14 13:34:47.913', '2026-07-14 13:34:47.913');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vho002q11psm5i1tvqt', 'cmrkp0vhm002p11psldcdaaqx', '30 g', 30, 150, '2026-07-14 13:34:47.916', '2026-07-14 13:34:47.916');
INSERT INTO public."FoodServing" VALUES ('cmrkp0vhv002s11psimzk01et', 'cmrkp0vhr002r11psnguh4xbr', '1 Mangkok (234 g)', 234, 61, '2026-07-14 13:34:47.923', '2026-07-14 13:34:47.923');


--
-- TOC entry 3567 (class 0 OID 76187)
-- Dependencies: 225
-- Data for Name: MagnesiumInterpretationRule; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."MagnesiumInterpretationRule" VALUES ('cmrkp0vi3002u11psvu0y002t', 0, 99.9, 'Kurang', 'Asupan magnesium harian Anda kurang dari target AKG. Disarankan untuk meningkatkan konsumsi makanan tinggi magnesium seperti bayam, kedelai, atau kacang almond.', '2026-07-14 13:34:47.931', '2026-07-14 13:34:47.931');
INSERT INTO public."MagnesiumInterpretationRule" VALUES ('cmrkp0vi5002v11ps9yqudnoz', 100, 9999, 'Cukup', 'Asupan magnesium harian Anda telah memenuhi target AKG. Pertahankan pola makan sehat Anda!', '2026-07-14 13:34:47.933', '2026-07-14 13:34:47.933');


--
-- TOC entry 3566 (class 0 OID 76176)
-- Dependencies: 224
-- Data for Name: MagnesiumTarget; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."MagnesiumTarget" VALUES ('cmrkp0vhz002t11psd961ugu4', 320, true, '2026-07-14 13:34:47.927', '2026-07-14 13:34:47.927');


--
-- TOC entry 3546 (class 0 OID 75978)
-- Dependencies: 204
-- Data for Name: MotherProfile; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3555 (class 0 OID 76072)
-- Dependencies: 213
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Notification" VALUES ('cmrkpatch002dvspsi8sjdzy9', 'ASSESSMENT_ASSIGNED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Tugas Skrining Baru Tersedia', 'Halo Karlina, Anda mendapatkan tugas pengisian skrining baru "Edinburgh Postnatal Depression Scale (EPDS)". Harap segera mengisi lembar instrumen sebelum tanggal 19 Jul 2026 demi menjaga kesehatan masa nifas Anda.', 'IN_APP', 'UNREAD', '2026-07-14 13:42:31.697', NULL);
INSERT INTO public."Notification" VALUES ('cmrkpatcy002evsps5whnm64d', 'ASSESSMENT_ASSIGNED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Tugas Skrining Baru Tersedia', 'Halo Karlina, Anda mendapatkan tugas pengisian skrining baru "Edinburgh Postnatal Depression Scale (EPDS)". Harap segera mengisi lembar instrumen sebelum tanggal 19 Jul 2026 demi menjaga kesehatan masa nifas Anda.', 'EMAIL', 'READ', '2026-07-14 13:42:31.714', NULL);
INSERT INTO public."Notification" VALUES ('cmrkpateh002gvsps4i54jmid', 'ASSESSMENT_ASSIGNED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Tugas Skrining Baru Tersedia', 'Halo Karlina, Anda mendapatkan tugas pengisian skrining baru "Skrining Asupan Magnesium Harian". Harap segera mengisi lembar instrumen sebelum tanggal 19 Jul 2026 demi menjaga kesehatan masa nifas Anda.', 'IN_APP', 'UNREAD', '2026-07-14 13:42:31.77', NULL);
INSERT INTO public."Notification" VALUES ('cmrkpatf3002hvsps1vco8xrw', 'ASSESSMENT_ASSIGNED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Tugas Skrining Baru Tersedia', 'Halo Karlina, Anda mendapatkan tugas pengisian skrining baru "Skrining Asupan Magnesium Harian". Harap segera mengisi lembar instrumen sebelum tanggal 19 Jul 2026 demi menjaga kesehatan masa nifas Anda.', 'EMAIL', 'READ', '2026-07-14 13:42:31.791', NULL);
INSERT INTO public."Notification" VALUES ('cmrkpatg3002jvspsjlwt7y3h', 'MOTHER_ACTIVATED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Selamat Datang di Nifas Care!', 'Halo Karlina, akun Anda telah berhasil diverifikasi oleh Bidan. Anda kini dapat mulai mengisi instrumen pemantauan kesehatan postpartum secara berkala pada aplikasi.', 'EMAIL', 'READ', '2026-07-14 13:42:31.827', NULL);
INSERT INTO public."Notification" VALUES ('cmrkpatfm002ivspswkxatdu8', 'MOTHER_ACTIVATED', 'cmrkp564e0028vspst7tgp1tc', 'MOTHER', 'Selamat Datang di Nifas Care!', 'Halo Karlina, akun Anda telah berhasil diverifikasi oleh Bidan. Anda kini dapat mulai mengisi instrumen pemantauan kesehatan postpartum secara berkala pada aplikasi.', 'IN_APP', 'UNREAD', '2026-07-14 13:42:31.811', NULL);


--
-- TOC entry 3547 (class 0 OID 75995)
-- Dependencies: 205
-- Data for Name: OnboardingVerification; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3560 (class 0 OID 76121)
-- Dependencies: 218
-- Data for Name: RedFlagRule; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."RedFlagRule" VALUES ('cmrkp0vfg001r11psrtwtpmj5', 'cmrkp0vby000611ps6m3k26eo', 'epds_q10', 1, 'URGENT', 'Pikiran menyakiti diri sendiri', '2026-07-14 13:34:47.836', '2026-07-14 13:34:47.836');


--
-- TOC entry 3554 (class 0 OID 76063)
-- Dependencies: 212
-- Data for Name: ReminderHistory; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3553 (class 0 OID 76054)
-- Dependencies: 211
-- Data for Name: ReminderRule; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3544 (class 0 OID 75964)
-- Dependencies: 202
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3542 (class 0 OID 75945)
-- Dependencies: 200
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" VALUES ('cmrkp0vbc000411psijkilh1a', 'Mother User', 'mother@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'MOTHER', '2026-07-14 13:34:47.688', '2026-07-14 13:34:47.688', 'PENDING_ONBOARDING');
INSERT INTO public."User" VALUES ('cmrkp0v9k000011psnr4eqjey', 'Admin User', 'admin@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'ADMIN', '2026-07-14 13:34:47.624', '2026-07-14 13:34:47.624', 'ACTIVE');
INSERT INTO public."User" VALUES ('cmrkp0vbg000511psb9cjj0b6', 'Researcher User', 'researcher@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'RESEARCHER', '2026-07-14 13:34:47.692', '2026-07-14 13:34:47.692', 'ACTIVE');
INSERT INTO public."User" VALUES ('cmrkp0vb0000111ps76makbdh', 'Dokter X', 'dokter@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'DOCTOR', '2026-07-14 13:34:47.676', '2026-07-14 13:34:47.676', 'ACTIVE');
INSERT INTO public."User" VALUES ('cmrkp0vba000311psur2c6jbg', 'Ahli Gizi X', 'ahligizi@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'NUTRITIONIST', '2026-07-14 13:34:47.686', '2026-07-14 13:34:47.686', 'ACTIVE');
INSERT INTO public."User" VALUES ('cmrkp0vb5000211pssl97m6d2', 'Bidan X', 'bidan@nifascare.com', NULL, NULL, '$2b$10$7JlGsvzxjlL1jA44DTwqn.qkKnrn9jPm5fWQwI.7pk1OGpZD7c4GW', 'MIDWIFE', '2026-07-14 13:34:47.681', '2026-07-14 13:34:47.681', 'ACTIVE');
INSERT INTO public."User" VALUES ('cmrkp564e0028vspst7tgp1tc', 'Karlina', 'gadog.tolis@gmail.com', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocI4sOef-DPmye5p_yCjRWMYvc4lum3YqrETmONc-GaHezIDHCrw=s96-c', '$2b$10$eFgDlQ/ivlak7pT196WOc.VPAsWKDMehwL8MSf73wtLySWdeiTNEO', 'MOTHER', '2026-07-14 13:38:08.318', '2026-07-14 13:42:31.358', 'PENDING_ONBOARDING');


--
-- TOC entry 3545 (class 0 OID 75972)
-- Dependencies: 203
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3330 (class 2606 OID 75963)
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 76120)
-- Name: AssessmentInterpretation AssessmentInterpretation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentInterpretation"
    ADD CONSTRAINT "AssessmentInterpretation_pkey" PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 76111)
-- Name: AssessmentOption AssessmentOption_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentOption"
    ADD CONSTRAINT "AssessmentOption_pkey" PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 76102)
-- Name: AssessmentQuestion AssessmentQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentQuestion"
    ADD CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY (id);


--
-- TOC entry 3345 (class 2606 OID 76023)
-- Name: AssessmentReview AssessmentReview_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentReview"
    ADD CONSTRAINT "AssessmentReview_pkey" PRIMARY KEY (id);


--
-- TOC entry 3352 (class 2606 OID 76053)
-- Name: AssessmentSchedule AssessmentSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentSchedule"
    ADD CONSTRAINT "AssessmentSchedule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 76043)
-- Name: AssessmentTemplate AssessmentTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentTemplate"
    ADD CONSTRAINT "AssessmentTemplate_pkey" PRIMARY KEY (id);


--
-- TOC entry 3343 (class 2606 OID 76013)
-- Name: Assessment Assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3361 (class 2606 OID 76091)
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 76138)
-- Name: ClinicalDecisionRule ClinicalDecisionRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalDecisionRule"
    ADD CONSTRAINT "ClinicalDecisionRule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3347 (class 2606 OID 76032)
-- Name: ClinicalIntervention ClinicalIntervention_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalIntervention"
    ADD CONSTRAINT "ClinicalIntervention_pkey" PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 76205)
-- Name: DailyMood DailyMood_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DailyMood"
    ADD CONSTRAINT "DailyMood_pkey" PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 76147)
-- Name: FollowUpRule FollowUpRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUpRule"
    ADD CONSTRAINT "FollowUpRule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 76156)
-- Name: FoodCategory FoodCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodCategory"
    ADD CONSTRAINT "FoodCategory_pkey" PRIMARY KEY (id);


--
-- TOC entry 3382 (class 2606 OID 76175)
-- Name: FoodServing FoodServing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodServing"
    ADD CONSTRAINT "FoodServing_pkey" PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 76166)
-- Name: Food Food_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_pkey" PRIMARY KEY (id);


--
-- TOC entry 3386 (class 2606 OID 76195)
-- Name: MagnesiumInterpretationRule MagnesiumInterpretationRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MagnesiumInterpretationRule"
    ADD CONSTRAINT "MagnesiumInterpretationRule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3384 (class 2606 OID 76186)
-- Name: MagnesiumTarget MagnesiumTarget_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MagnesiumTarget"
    ADD CONSTRAINT "MagnesiumTarget_pkey" PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 75994)
-- Name: MotherProfile MotherProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MotherProfile"
    ADD CONSTRAINT "MotherProfile_pkey" PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 76081)
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 76003)
-- Name: OnboardingVerification OnboardingVerification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OnboardingVerification"
    ADD CONSTRAINT "OnboardingVerification_pkey" PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 76129)
-- Name: RedFlagRule RedFlagRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RedFlagRule"
    ADD CONSTRAINT "RedFlagRule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 76071)
-- Name: ReminderHistory ReminderHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReminderHistory"
    ADD CONSTRAINT "ReminderHistory_pkey" PRIMARY KEY (id);


--
-- TOC entry 3355 (class 2606 OID 76062)
-- Name: ReminderRule ReminderRule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReminderRule"
    ADD CONSTRAINT "ReminderRule_pkey" PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 75971)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 75955)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3331 (class 1259 OID 76207)
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- TOC entry 3364 (class 1259 OID 76214)
-- Name: AssessmentQuestion_templateId_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AssessmentQuestion_templateId_code_key" ON public."AssessmentQuestion" USING btree ("templateId", code);


--
-- TOC entry 3348 (class 1259 OID 76212)
-- Name: AssessmentTemplate_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AssessmentTemplate_code_key" ON public."AssessmentTemplate" USING btree (code);


--
-- TOC entry 3387 (class 1259 OID 76217)
-- Name: DailyMood_motherId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "DailyMood_motherId_date_key" ON public."DailyMood" USING btree ("motherId", date);


--
-- TOC entry 3375 (class 1259 OID 76215)
-- Name: FoodCategory_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "FoodCategory_name_key" ON public."FoodCategory" USING btree (name);


--
-- TOC entry 3378 (class 1259 OID 76216)
-- Name: Food_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Food_name_key" ON public."Food" USING btree (name);


--
-- TOC entry 3339 (class 1259 OID 76211)
-- Name: MotherProfile_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MotherProfile_userId_key" ON public."MotherProfile" USING btree ("userId");


--
-- TOC entry 3353 (class 1259 OID 76213)
-- Name: ReminderRule_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ReminderRule_code_key" ON public."ReminderRule" USING btree (code);


--
-- TOC entry 3334 (class 1259 OID 76208)
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- TOC entry 3326 (class 1259 OID 76206)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3335 (class 1259 OID 76210)
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- TOC entry 3336 (class 1259 OID 76209)
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- TOC entry 3390 (class 2606 OID 76218)
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3405 (class 2606 OID 76293)
-- Name: AssessmentInterpretation AssessmentInterpretation_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentInterpretation"
    ADD CONSTRAINT "AssessmentInterpretation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3404 (class 2606 OID 76288)
-- Name: AssessmentOption AssessmentOption_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentOption"
    ADD CONSTRAINT "AssessmentOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."AssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3403 (class 2606 OID 76283)
-- Name: AssessmentQuestion AssessmentQuestion_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentQuestion"
    ADD CONSTRAINT "AssessmentQuestion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3397 (class 2606 OID 76253)
-- Name: AssessmentReview AssessmentReview_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentReview"
    ADD CONSTRAINT "AssessmentReview_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3398 (class 2606 OID 76258)
-- Name: AssessmentReview AssessmentReview_reviewerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentReview"
    ADD CONSTRAINT "AssessmentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3400 (class 2606 OID 76268)
-- Name: AssessmentSchedule AssessmentSchedule_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssessmentSchedule"
    ADD CONSTRAINT "AssessmentSchedule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3395 (class 2606 OID 76248)
-- Name: Assessment Assessment_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3396 (class 2606 OID 76243)
-- Name: Assessment Assessment_motherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3402 (class 2606 OID 76278)
-- Name: Assignment Assignment_motherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3407 (class 2606 OID 76303)
-- Name: ClinicalDecisionRule ClinicalDecisionRule_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalDecisionRule"
    ADD CONSTRAINT "ClinicalDecisionRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 76263)
-- Name: ClinicalIntervention ClinicalIntervention_assessmentReviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClinicalIntervention"
    ADD CONSTRAINT "ClinicalIntervention_assessmentReviewId_fkey" FOREIGN KEY ("assessmentReviewId") REFERENCES public."AssessmentReview"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3411 (class 2606 OID 76323)
-- Name: DailyMood DailyMood_motherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DailyMood"
    ADD CONSTRAINT "DailyMood_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3408 (class 2606 OID 76308)
-- Name: FollowUpRule FollowUpRule_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FollowUpRule"
    ADD CONSTRAINT "FollowUpRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3410 (class 2606 OID 76318)
-- Name: FoodServing FoodServing_foodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FoodServing"
    ADD CONSTRAINT "FoodServing_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3409 (class 2606 OID 76313)
-- Name: Food Food_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."FoodCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3392 (class 2606 OID 76228)
-- Name: MotherProfile MotherProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MotherProfile"
    ADD CONSTRAINT "MotherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3393 (class 2606 OID 76238)
-- Name: OnboardingVerification OnboardingVerification_midwifeUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OnboardingVerification"
    ADD CONSTRAINT "OnboardingVerification_midwifeUserId_fkey" FOREIGN KEY ("midwifeUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3394 (class 2606 OID 76233)
-- Name: OnboardingVerification OnboardingVerification_motherUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OnboardingVerification"
    ADD CONSTRAINT "OnboardingVerification_motherUserId_fkey" FOREIGN KEY ("motherUserId") REFERENCES public."MotherProfile"("userId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3406 (class 2606 OID 76298)
-- Name: RedFlagRule RedFlagRule_templateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RedFlagRule"
    ADD CONSTRAINT "RedFlagRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES public."AssessmentTemplate"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3401 (class 2606 OID 76273)
-- Name: ReminderHistory ReminderHistory_ruleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReminderHistory"
    ADD CONSTRAINT "ReminderHistory_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES public."ReminderRule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3391 (class 2606 OID 76223)
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-07-23 10:11:07 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict q4JaB1iiPn3WaF57EgSmBpOGZ6s55dILPgNqpbrqer4bhdVNbZohLEJRP2fBJOm

