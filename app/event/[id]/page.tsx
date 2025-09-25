import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import DeleteEventButton from "./DeleteEventButton";
import EventRealtime from "./EventRealtime";
import LeaveEventButton from "./LeaveEventButton";
import CopyEventId from "./CopyEventId";
import AssignPodsButton from "./AssignPodsButton";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { create?: string };
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const eventId = params.id;
  if (searchParams.create === "1") {
    await supabase.from("events").upsert({ id: eventId, created_by: user.id });
  }
  await supabase
    .from("event_participants")
    .upsert({ event_id: eventId, user_id: user.id });

  const { data: participants } = await supabase
    .from("event_participants_view")
    .select("user_id, username, avatar_url")
    .eq("event_id", eventId);

  const { data: event } = await supabase
    .from("events")
    .select("id, created_by")
    .eq("id", eventId)
    .maybeSingle();
  const isOwner = event?.created_by === user.id;

  const selfName =
    participants?.find((p) => p.user_id === user.id)?.username ??
    user.email ??
    user.id;
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <EventRealtime id={eventId} selfName={selfName} />
      <Card>
        <CardContent>
          <Stack gap={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                display="flex"
                alignItems="center"
                gap={1}
              >
                Event {eventId}
                <CopyEventId id={eventId} />
              </Typography>
              <Stack direction="row" gap={2}>
                <LeaveEventButton
                  id={eventId}
                  userId={user.id}
                  selfName={selfName}
                />
                {isOwner && <AssignPodsButton id={eventId} />}
                {isOwner && <DeleteEventButton id={eventId} />}
              </Stack>
            </Stack>
            <Divider />
            <Typography variant="h6">Players</Typography>
            <List>
              {(participants ?? []).map((p) => (
                <ListItem key={p.user_id}>
                  <ListItemText
                    primary={p.username ?? p.user_id}
                    secondary={
                      p.avatar_url ? <Chip label="avatar" /> : undefined
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Typography variant="h6">Pods</Typography>
            {/* Fetch and show pods */}
            {await (async () => {
              const { data } = await fetch(
                `${
                  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
                }/api/events/${eventId}/pods`,
                { cache: "no-store" }
              )
                .then((r) => r.json())
                .catch(() => ({ data: null }));
              const pods = data?.pods ?? data ?? [];
              return (
                <Stack gap={1}>
                  {pods.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No pods yet
                    </Typography>
                  )}
                  {pods.map((pod: any) => (
                    <Stack key={pod.index}>
                      <Typography variant="subtitle1">
                        Pod {pod.index + 1}
                      </Typography>
                      <List>
                        {pod.players.map((pl: any) => (
                          <ListItem key={pl.id}>
                            <ListItemText primary={pl.name} />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  ))}
                </Stack>
              );
            })()}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
