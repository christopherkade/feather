"use client";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";

type Card = { id: string; name: string };

export default function DecksPage() {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [chosen, setChosen] = useState<Card[]>([]);
  const [decks, setDecks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/decks");
      if (res.ok) setDecks((await res.json()).decks ?? []);
    })();
  }, []);

  async function search() {
    const res = await fetch(
      `/api/scryfall/search?q=${encodeURIComponent(query)}`
    );
    const json = await res.json();
    const cards = (json?.data ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
    })) as Card[];
    setResults(cards);
  }

  async function saveDeck() {
    await fetch("/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        commander_scryfall_ids: chosen.map((c) => c.id),
      }),
    });
    setName("");
    setChosen([]);
    const res = await fetch("/api/decks");
    if (res.ok) setDecks((await res.json()).decks ?? []);
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Typography variant="h5">Decks</Typography>
            <Stack gap={2}>
              <TextField
                label="Deck name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Stack direction="row" gap={2}>
                <TextField
                  label="Search commander"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={search}>
                  Search
                </Button>
              </Stack>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {results.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.name}
                    onClick={() =>
                      setChosen((prev) =>
                        prev.find((x) => x.id === c.id) ? prev : [...prev, c]
                      )
                    }
                  />
                ))}
              </Stack>
              <Typography variant="subtitle1">Chosen commanders</Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {chosen.map((c) => (
                  <Chip
                    key={c.id}
                    label={c.name}
                    onDelete={() =>
                      setChosen((prev) => prev.filter((x) => x.id !== c.id))
                    }
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                onClick={saveDeck}
                disabled={!name || chosen.length === 0}
              >
                Save deck
              </Button>
            </Stack>

            <Divider />
            <Typography variant="h6">Your decks</Typography>
            <List>
              {decks.map((d) => (
                <ListItem key={d.id}>
                  <ListItemText
                    primary={d.name}
                    secondary={
                      (d.commander_scryfall_ids ?? []).length + " commanders"
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
