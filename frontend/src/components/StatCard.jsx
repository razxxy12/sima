const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

export default StatCard;