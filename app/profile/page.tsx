"use client";
import {
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Avatar,
  Autocomplete,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";

const COLOR_OPTIONS = ["White", "Blue", "Black", "Red", "Green"]; // WUBRG

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const { profile } = await res.json();
        if (profile) {
          setUsername(profile.username ?? "");
          setAvatarUrl(profile.avatar_url ?? "");
          setFavoriteColors(profile.favorite_colors ?? []);
        }
      }
    })();
  }, []);

  async function save() {
    setLoading(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        avatar_url: avatarUrl,
        favorite_colors: favoriteColors,
      }),
    });
    setLoading(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h5">Profile</Typography>
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar src={avatarUrl} />
              <TextField
                label="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Autocomplete
              multiple
              options={COLOR_OPTIONS}
              value={favoriteColors}
              onChange={(_, v) => setFavoriteColors(v)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Favorite colors" />
              )}
            />
            <Button variant="contained" onClick={save} disabled={loading}>
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
