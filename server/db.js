const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbPassword = "postgres";
const database = "network";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbPassword}@localhost:5432/${database}`
);

module.exports.addUserData = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES($1, $2, $3, $4)
                RETURNING id`;
    const params = [first, last, email, password];
    return db.query(q, params).then((result) => {
        return result.rows;
    });
};

module.exports.getHashPw = (par) => {
    const params = [par];
    return db
        .query(`SELECT password FROM users WHERE email=$1`, params)
        .then((result) => {
            return result.rows;
        });
};

module.exports.getID = (par) => {
    const params = [par];
    return db
        .query(`SELECT id FROM users WHERE email=$1`, params)
        .then((result) => {
            return result.rows;
        });
};

module.exports.searchEmail = (mail) => {
    const params = [mail];
    return db
        .query(`SELECT id FROM users WHERE email=$1`, params)
        .then((result) => {
            return result.rows;
        });
};

module.exports.insertResetCode = (mail, code) => {
    const params = [mail, code];
    return db.query(
        `INSERT INTO reset_codes (email, code)
                VALUES($1, $2)`,
        params
    );
};

module.exports.validateInputCode = (mail) => {
    const params = [mail];
    return db
        .query(
            `SELECT code FROM reset_codes WHERE email=$1 AND created_at = (SELECT MAX(created_at) FROM reset_codes) ORDER BY created_at DESC`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.resetPassword = (password, email) => {
    const params = [password, email];
    return db.query(`UPDATE users SET password=$1 WHERE email=$2`, params);
};

module.exports.upsertProfilePic = (filename, id) => {
    const params = [filename, id];
    return db
        .query(
            `UPDATE users 
                SET image_url=$1
                WHERE users.id = $2
                RETURNING image_url
                ;`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.getUserData = (id) => {
    const params = [id];
    return db
        .query(
            `SELECT first, last, image_url, bio FROM users
            WHERE id=$1`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.updateBio = (bio, id) => {
    const params = [bio, id];
    return db
        .query(
            `UPDATE users 
                SET bio=$1
                WHERE users.id = $2
                RETURNING bio
                ;`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.getThreePeople = () => {
    return db
        .query(
            `SELECT first, last, id, image_url FROM users
    ORDER BY id DESC
    LIMIT 3`
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.findPeople = (searchterm) => {
    const params = [`${searchterm}%`];
    return db
        .query(
            `SELECT first, last, id, image_url FROM users
            WHERE first ILIKE $1
            ORDER BY id DESC
            LIMIT 10;`,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.addFriendRelation = (loggedInId, viewdId) => {
    const params = [loggedInId, viewdId];
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id) VALUES($1, $2)`,
        params
    );
};

module.exports.checkFriendship = (loggedInId, viewdId) => {
    const params = [loggedInId, viewdId];
    return db
        .query(
            `
            SELECT * FROM friendships
            WHERE (recipient_id = $2 AND sender_id = $1)
            OR (recipient_id = $1 AND sender_id = $2);
            `,
            params
        )
        .then((result) => {
            return result.rows;
        });
};

module.exports.acceptFriend = (loggedInId, viewdId) => {
    const params = [loggedInId, viewdId];
    return db.query(
        `   UPDATE friendships SET accepted=true
            WHERE (recipient_id = $2 AND sender_id = $1)
            OR (recipient_id = $1 AND sender_id = $2);`,
        params
    );
};

module.exports.deleteFriend = (loggedInId, viewdId) => {
    const params = [loggedInId, viewdId];
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $2 AND sender_id = $1)
        OR (recipient_id = $1 AND sender_id = $2);`,
        params
    );
};

module.exports.getFriendsAndWannbes = (id) => {
    const params = [id];
    const q = `
      SELECT users.id, first, last, image_url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  `;
    return db.query(q, params).then((results) => {
        return results.rows;
    });
};

module.exports.getLastTenMessages = () => {
    return db
        .query(
            `
    SELECT users.id, first, last, image_url, chat_messages.id AS message_id, chat_messages.message, chat_messages.created_at
    FROM chat_messages
    JOIN users
    ON users.id = chat_messages.user_id
    ORDER BY chat_messages.created_at DESC
    LIMIT 10;`
        )
        .then((results) => {
            return results.rows;
        });
};

module.exports.addMessage = (userId, message) => {
    const params = [userId, message];
    return db
        .query(
            `
        INSERT INTO chat_messages (user_id, message)
        VALUES ($1, $2);
        `,
            params
        )
        .then((results) => {
            return results.rows;
        });
};

module.exports.getMessage = (userId) => {
    const params = [userId];
    return db
        .query(
            `
        SELECT users.id, first, last, image_url, chat_messages.message, chat_messages.created_at
        FROM chat_messages
        JOIN users
        ON users.id = chat_messages.user_id
        WHERE users.id = $1
        ORDER BY chat_messages.id DESC
        LIMIT 1;
        `,
            params
        )
        .then((results) => {
            return results.rows;
        });
};

module.exports.addDoodle = (senderId, receiverId, imageUrl) => {
    const params = [senderId, receiverId, imageUrl];
    return db
        .query(
            `
        INSERT INTO doodles (sender_id, recipient_id, image_url)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
            params
        )
        .then((results) => {
            return results.rows;
        });
};

module.exports.getDoodles = (userId) => {
    const params = [userId];
    return db
        .query(
            `SELECT users.id, first, last, doodles.image_url, doodles.created_at
        FROM doodles
        JOIN users
        ON users.id = doodles.sender_id
        WHERE recipient_id=$1`,
            params
        )
        .then((results) => {
            return results.rows;
        });
};
