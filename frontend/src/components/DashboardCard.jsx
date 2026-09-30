import { ArrowUpRight } from "lucide-react";
import "./DashboardCard.css";

export default function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
}) {
  return (
    <article
      className={`dashboard-card dashboard-card-${variant}`}
    >
      {/* Card Header */}

      <div className="dashboard-card-top">
        <div className="dashboard-card-icon">
          {Icon && <Icon size={21} />}
        </div>

        {trend && (
          <span className="dashboard-trend">
            <ArrowUpRight size={15} />
            {trend}
          </span>
        )}
      </div>

      {/* Card Content */}

      <div className="dashboard-card-body">
        <span className="dashboard-card-title">
          {title}
        </span>

        <strong className="dashboard-card-value">
          {value}
        </strong>

        {/* Footer */}

        {(description || trendLabel) && (
          <div className="dashboard-card-footer">
            {description && (
              <span>{description}</span>
            )}

            {trendLabel && (
              <span>{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}