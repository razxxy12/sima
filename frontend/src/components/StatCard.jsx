const StatCard = ({ icon, label, value, color = 'text-electric-blue', glowColor = 'bg-electric-blue' }) => (
  <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-44 relative overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <div>
        <span className="text-label-md text-outline">{label}</span>
        <h2 className="text-headline-xl font-bold text-on-surface mt-2">{value}</h2>
      </div>
      <div className={`bg-white/5 p-3 rounded-lg border border-white/10`}>
        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
      </div>
    </div>
    {/* Subtle background glow */}
    <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${glowColor}/5 rounded-full blur-3xl`} />
  </div>
);

export default StatCard;
