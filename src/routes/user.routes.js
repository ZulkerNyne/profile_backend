import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
const router = Router();

// shared in-memory store
const users = globalThis.__users || (globalThis.__users = []);

router.get("/", (req, res) => {
  const safeUsers = users.map(({passwordHash,...rest})=>rest);
  res.json({ count: safeUsers.length, users:safeUsers });
});
router.get("/me", authRequired, (req, res) => {
  const userId = req.user.userId;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { passwordHash, ...safeUser } = user;
  return res.json(safeUser);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user id" });

  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const {passwordHash, ...safeUser}= user;
  return res.json(safeUser);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user id" });

  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { fullName, bio } = req.body;

  if (fullName !== undefined) {
    if (typeof fullName !== "string" || fullName.trim() === "") {
      return res.status(400).json({ error: "fullName must be a non-empty string" });
    }
    user.fullName = fullName.trim();
  }

  if (bio !== undefined) {
    if (typeof bio !== "string") {
      return res.status(400).json({ error: "bio must be a string" });
    }
    user.bio = bio;
  }

  user.updatedAt = new Date().toISOString();
  const { passwordHash, ...safeUser } = user;
return res.json({ message: "User updated (in memory)", user: safeUser });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user id" });

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const deletedUser = users[index];
  users.splice(index, 1);

  return res.json({
    message: "User deleted (in memory)",
    deletedUser: { id: deletedUser.id, email: deletedUser.email, fullName: deletedUser.fullName },
  });
});

export default router;