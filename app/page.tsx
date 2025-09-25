import Image from "next/image";
import styles from "./page.module.css";
import { getSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Button,
  Stack,
  Typography,
  Container,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";

async function signInWithGoogle() {
  "use server";
  const supabase = getSupabaseServer();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/api/auth/callback` },
  });
  if (error) {
    console.error(error);
    return;
  }
  if (data?.url) redirect(data.url);
}

async function signOut() {
  "use server";
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const eventDeleted = !!searchParams?.eventDeleted;
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      {eventDeleted && (
        <Snackbar open autoHideDuration={4000}>
          <Alert severity="info" variant="filled" icon={false}>
            Event was deleted by the owner
          </Alert>
        </Snackbar>
      )}
      <Card elevation={2}>
        <CardContent>
          <Stack gap={3} alignItems="center">
            <Typography variant="h4">Feather Pods</Typography>
            {!user ? (
              <form action={signInWithGoogle}>
                <Button variant="contained" type="submit" size="large">
                  Sign in with Google
                </Button>
              </form>
            ) : (
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <form action={signOut}>
                  <Button variant="outlined" type="submit">
                    Sign out
                  </Button>
                </form>
                <Button
                  LinkComponent={Link}
                  href="/dashboard"
                  variant="contained"
                >
                  Dashboard
                </Button>
                <Button
                  LinkComponent={Link}
                  href="/event/new"
                  variant="contained"
                >
                  Create Event
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
