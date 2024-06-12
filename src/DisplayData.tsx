import React from 'react';
import './DisplayData.css';

interface DisplayDataProps {
  users: { id: string; name: string; phone_number: string }[];
  deleteUser: (id: string) => void;
}

const DisplayData: React.FC<DisplayDataProps> = ({ users, deleteUser }) => {
  return (
    <div>
      <ul>
        {users.map((user) => (
          <li onClick={() => deleteUser(user.id)} key={user.id}>
            {user.name} - {user.phone_number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayData;
