import { getDBConnection } from "../db/db.js";

export async function getCurrentUser(req, res) {
	let db;
	try {
		if (!req.session.userId) {
			return res.json({ isLoggedIn: false });
		}

		db = await getDBConnection();

		const user = await db.get("SELECT name FROM users WHERE id = ?", [
			req.session.userId,
		]);

		res.json({ isLoggedIn: true, name: user.name });
	} catch (err) {
		console.error("getCurrentUser error:", err);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		if (db) await db.close();
	}
}
