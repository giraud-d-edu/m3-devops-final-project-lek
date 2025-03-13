import "./stat_profile.css";
import "../../style/global.css";
import { StatProfileProps } from "../../models/stat";
import target_icon from "/images/icons/target.png";

export const StatProfile: React.FC<StatProfileProps> = ({ title, value }) => {
  // ---------------------------------- //
  // -----------Format Stat------------ //
  // ---------------------------------- //
  const formatStat = (data: string): string => {
    const value = parseInt(data);
    if (value >= 1000000000000) {
      const formattedValue = (value / 1000000000000).toFixed(1);
      return formattedValue + "Td";
    } else if (value >= 1000000000) {
      const formattedValue = (value / 1000000000).toFixed(1);
      return formattedValue + "Md";
    } else if (value >= 1000000) {
      const formattedValue = (value / 1000000).toFixed(1);
      return formattedValue + "M";
    }
    return data;
  };

  return (
    <article className="flex-col container-stat-profile">
      <img src={target_icon} />
      <h2>{title}</h2>
      <p>{formatStat(value)}</p>
    </article>
  );
};
