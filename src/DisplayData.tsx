import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import './DisplayData.css';

const client = generateClient<Schema>();

export default function DisplayData() {
  const [users, setUsers] = useState<Array<Schema["UserData"]["type"]>>([]);

  useEffect(() => {
    client.models.UserData.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }, []);

  function createUser() {
    const name = window.prompt("Name");
    const phone_number = window.prompt("Phone number");
    const height = Number(window.prompt("Height"));
    const weight = Number(window.prompt("Weight"));
    const date_of_birth = window.prompt("Date of birth");
    client.models.UserData.create({ name, phone_number, height, weight, date_of_birth });
  }

  function deleteUser(id: string) {
    client.models.UserData.delete({ id });
  }

  return (
    <div>
      <button onClick={createUser}>+ new user</button>
      <ul>
        {users.map((user) => (
          <li
            onClick={() => deleteUser(user.id)}
            key={user.id}>{user.name} - {user.phone_number}</li>
        ))}
      </ul>
    </div>
  );
}
