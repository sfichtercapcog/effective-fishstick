import React from 'react';
import styles from '../styles/CrashDashboard.module.css';

interface ChartSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ChartSection({
  title,
  subtitle,
  children,
}: ChartSectionProps) {
  return (
    <div className={styles.chartSection}>
      <h3>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}