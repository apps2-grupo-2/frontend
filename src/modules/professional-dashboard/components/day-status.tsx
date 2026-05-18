type DayStatusProps = {
  totalAppointments: number;
  totalAvailable: number;
};

export const DayStatus = (props: DayStatusProps) => {
  const { totalAppointments, totalAvailable } = props;

  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
        <span className="font-semibold text-primary">{totalAppointments}</span>
        <span className="text-muted-foreground">turnos</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-success/5 px-3 py-2 text-xs">
        <span className="font-semibold text-success">{totalAvailable}</span>
        <span className="text-muted-foreground">disponibles</span>
      </div>
    </div>
  );
};