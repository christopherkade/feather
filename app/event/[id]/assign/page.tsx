import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { assignToPods } from "@/lib/pods/assign";
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Typography,
  Container,
} from "@mui/material";

export default async function AssignPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const eventId = params.id;
  const { data: event } = await supabase
    .from("events")
    .select("id, created_by")
    .eq("id", eventId)
    .maybeSingle();
  if (!event || event.created_by !== user.id) redirect(`/event/${eventId}`);

  const { data: participants } = await supabase
    .from("event_participants_view")
    .select("user_id, username")
    .eq("event_id", eventId);

  const pods = assignToPods(
    (participants ?? []).map((p) => ({
      id: p.user_id,
      name: p.username ?? p.user_id,
    })),
    4
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack gap={2}>
        <Typography variant="h5">Assigned Pods</Typography>
        <Grid container gap={2}>
          {pods.map((pod, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Pod {idx + 1}</Typography>
                  <Stack>
                    {pod.map((player) => (
                      <Typography key={player.id}>{player.name}</Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
