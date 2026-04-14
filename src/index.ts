import { Hono } from 'hono';

const app=new Hono();

app.get("/", (c)=>{
  return c.text("Hello Hono!")
})

type User= {
id: string;
name: string;
email: string;
password: string;
}

const users: User[]=[]
app.get("/users",(c)=>{
  return c.json(users)
})

app.get("/users/:id", (c) => {
  const id = c.req.param("id"); // already string

  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

app.post("/signup", async (c) => {
  const body = await c.req.json();
  const { name, email, password } = body;

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return c.json({ error: "email already exists" }, 400);
  }

  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    password,
  };

  users.push(newUser);

  return c.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  });
});

app.post("/signin", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return c.json({ error: "invalid email or password" }, 401);
  }

  return c.json({
    message: "login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export default app;
