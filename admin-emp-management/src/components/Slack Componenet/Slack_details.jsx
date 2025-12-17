export default function Slack_details({ selectedUser }) {
  if (!selectedUser)
    return (
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg">Select a conversation</h2>
      </div>
    );

  return (
    <div className="p-4 border-b bg-white shadow">
      <h2 className="text-xl font-bold">{selectedUser.name}</h2>
      <p className="text-sm text-gray-500">{selectedUser.email}</p>
    </div>
  );
}
