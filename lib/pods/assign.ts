export type Player = { id: string; name: string };
export type Pod = Player[];

export type AssignResult =
  | { ok: true; pods: Pod[] }
  | { ok: false; error: string };

export function assignToPods(
  players: Player[],
  preferredSize: number = 4
): AssignResult {
  const total = players.length;
  if (total < 3)
    return { ok: false, error: "Need at least 3 players to assign pods" };
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  // Try to maximize 4s and avoid 1-2 leftovers by using some heuristics
  for (let numFours = Math.floor(total / 4); numFours >= 0; numFours--) {
    const remaining = total - numFours * 4;
    if (remaining === 0) {
      // perfect 4s
      const pods: Pod[] = [];
      let idx = 0;
      for (let i = 0; i < numFours; i++)
        pods.push(shuffled.slice(idx, (idx += 4)));
      return { ok: true, pods };
    }
    if (remaining >= 3) {
      // one last pod of 3..5. Prefer 3 or 4; 5 would happen only if total%4==1 and we choose to make a 5 (but we avoid 5)
      if (remaining === 3) {
        const pods: Pod[] = [];
        let idx = 0;
        for (let i = 0; i < numFours; i++)
          pods.push(shuffled.slice(idx, (idx += 4)));
        pods.push(shuffled.slice(idx, (idx += 3)));
        return { ok: true, pods };
      }
      if (remaining === 4) {
        const pods: Pod[] = [];
        let idx = 0;
        for (let i = 0; i < numFours; i++)
          pods.push(shuffled.slice(idx, (idx += 4)));
        pods.push(shuffled.slice(idx, (idx += 4)));
        return { ok: true, pods };
      }
      if (remaining === 5) {
        // Convert one 4+5 => 3+3 if possible
        if (numFours >= 1) {
          const pods: Pod[] = [];
          let idx = 0;
          for (let i = 0; i < numFours - 1; i++)
            pods.push(shuffled.slice(idx, (idx += 4)));
          pods.push(shuffled.slice(idx, (idx += 3)));
          pods.push(shuffled.slice(idx, (idx += 3)));
          return { ok: true, pods };
        } else {
          // only 5 players → single pod of 5 is acceptable fallback
          return { ok: true, pods: [shuffled] };
        }
      }
    }
  }
  return { ok: false, error: "Unable to assign pods with minimum size of 3" };
}
