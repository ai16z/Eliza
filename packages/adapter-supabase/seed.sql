INSERT INTO public.accounts (id, name, email, "avatarUrl", details) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Agent', 'default@agent.com', '', '{}');
INSERT INTO public.rooms (id, "createdAt") VALUES ('00000000-0000-0000-0000-000000000000', NOW());
INSERT INTO public.participants (id, "createdAt", "userId", "roomId", "userState", last_message_read) VALUES ('00000000-0000-0000-0000-000000000000', NOW(), 'Default Agent', '00000000-0000-0000-0000-000000000000', NULL, NULL);
