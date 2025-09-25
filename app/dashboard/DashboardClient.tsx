"use client";
import Link from "next/link";
import {
  Container,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Box,
  CardActionArea,
} from "@mui/material";

export default function DashboardClient({
  userName,
  eventIds,
}: {
  userName?: string;
  eventIds: string[];
}) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Typography variant="h5">
              Welcome{userName ? `, ${userName}` : ""}
            </Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
              <Button
                LinkComponent={Link}
                href="/event/new"
                variant="contained"
              >
                Create Event
              </Button>
              <Button
                LinkComponent={Link}
                href="/event/join"
                variant="outlined"
              >
                Join Event
              </Button>
              <Button LinkComponent={Link} href="/profile" variant="text">
                Profile
              </Button>
              <Button LinkComponent={Link} href="/decks" variant="text">
                Decks
              </Button>
            </Stack>
            {eventIds.length > 0 && (
              <>
                <Typography variant="h6">Your events</Typography>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                  }}
                >
                  {eventIds.map((id) => (
                    <Card
                      key={id}
                      variant="outlined"
                      sx={{ ":hover": { boxShadow: 2 } }}
                    >
                      <CardActionArea
                        LinkComponent={Link}
                        href={`/event/${id}`}
                      >
                        <CardContent>
                          <Stack gap={1}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Event ID
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {id}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
