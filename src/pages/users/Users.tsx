import { useQuery } from "react-query";
import ApiCall from "src/endpoints/ApiCall";
import { isNotEmpty } from "src/utils/helpers";

const Users: React.FC = () => {
  const { data } = useQuery(["users"], ApiCall.getUsersPaginated, {
    retry: false,
  });

  const users = data?.data || [];

  return (
    <div>
      <h1>Users2</h1>
      <ul>
        {isNotEmpty(users) &&
          users.map((user) => (
            <li key={user.email}>{user.firstName + " " + user.lastName}</li>
          ))}
      </ul>
    </div>
  );
};

export default Users;
