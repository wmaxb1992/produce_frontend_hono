import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, Cloud, Leaf, Snowflake } from 'lucide-react-native';
import useThemeStore from '../../store/useThemeStore';
import { ThemeColors } from '../../types';
import colors from '../../constants/colors';

type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';

interface SeasonalBadgeProps {
  season: Season;
  isInSeason?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const SeasonalBadge = ({
  season,
  isInSeason = true,
  showLabel = true,
  size = 'medium',
  style,
}: SeasonalBadgeProps) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: colors.light };
  const themeColors = theme.colors || colors.light;
  const styles = createStyles(themeColors, size);

  const getSeasonIcon = () => {
    const iconColor = getIconStyle().color;
    switch (season) {
      case 'spring':
        return <Leaf size={styles.icon.width} color={iconColor} />;
      case 'summer':
        return <Sun size={styles.icon.width} color={iconColor} />;
      case 'fall':
        return <Leaf size={styles.icon.width} color={iconColor} />;
      case 'winter':
        return <Snowflake size={styles.icon.width} color={iconColor} />;
      case 'year-round':
        return <Cloud size={styles.icon.width} color={iconColor} />;
    }
  };

  const getIconStyle = () => {
    switch (season) {
      case 'spring':
        return { color: themeColors.success };
      case 'summer':
        return { color: themeColors.warning };
      case 'fall':
        return { color: themeColors.secondary };
      case 'winter':
        return { color: themeColors.info };
      default:
        return { color: themeColors.text };
    }
  };

  const getSeasonColor = () => {
    if (!isInSeason) return themeColors.gray[400];
    
    switch (season) {
      case 'spring':
        return themeColors.success;
      case 'summer':
        return themeColors.warning;
      case 'fall':
        return themeColors.secondary;
      case 'winter':
        return themeColors.info;
      default:
        return themeColors.text;
    }
  };

  const getSeasonLabel = () => {
    const seasonName = season === 'year-round' ? 'Year-Round' : 
      season.charAt(0).toUpperCase() + season.slice(1);
    
    return isInSeason ? `In Season: ${seasonName}` : `Out of Season: ${seasonName}`;
  };

  const badgeStyle = {
    ...styles.badge,
    backgroundColor: isInSeason ? getSeasonColor() + '20' : themeColors.gray[200],
  };

  const iconStyle = {
    ...styles.icon,
    color: getSeasonColor(),
  };

  return (
    <View style={[badgeStyle, style]}>
      <View style={styles.iconContainer}>{getSeasonIcon()}</View>
      {showLabel && <Text style={[styles.label, { color: getSeasonColor() }]}>{getSeasonLabel()}</Text>}
    </View>
  );
};

interface SeasonalAvailabilityProps {
  seasons: Season[];
  currentSeason: Season;
  style?: any;
}

export const SeasonalAvailability: React.FC<SeasonalAvailabilityProps> = ({ 
  seasons, 
  currentSeason, 
  style 
}) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: colors.light };
  const themeColors = theme.colors || colors.light;
  const styles = createStyles(themeColors, 'small');

  const allSeasons: Season[] = ['spring', 'summer', 'fall', 'winter'];
  
  return (
    <View style={[styles.availabilityContainer, style]}>
      <Text style={styles.availabilityTitle}>Seasonal Availability</Text>
      <View style={styles.seasonsRow}>
        {allSeasons.map((season) => {
          const isAvailable = seasons.includes(season);
          const isCurrent = season === currentSeason;
          
          return (
            <View 
              key={season} 
              style={[
                styles.seasonItem,
                isAvailable ? styles.seasonAvailable : styles.seasonUnavailable,
                isCurrent ? styles.seasonCurrent : null,
              ]}
            >
              <SeasonalBadge 
                season={season} 
                isInSeason={isAvailable} 
                showLabel={false} 
                size="small" 
              />
              <Text 
                style={[
                  styles.seasonLabel,
                  isAvailable ? styles.seasonLabelAvailable : styles.seasonLabelUnavailable,
                ]}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </Text>
              {isCurrent && <View style={styles.currentIndicator} />}
            </View>
          );
        })}
      </View>
      {seasons.includes('year-round') && (
        <View style={styles.yearRoundBadge}>
          <SeasonalBadge season="year-round" size="small" />
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: any, size: 'small' | 'medium' | 'large') => {
  const sizeMap = {
    small: {
      badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
      },
      icon: {
        width: 14,
        height: 14,
      },
      label: {
        fontSize: 12,
        marginLeft: 4,
      },
    },
    medium: {
      badge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
      },
      icon: {
        width: 16,
        height: 16,
      },
      label: {
        fontSize: 14,
        marginLeft: 6,
      },
    },
    large: {
      badge: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      },
      icon: {
        width: 20,
        height: 20,
      },
      label: {
        fontSize: 16,
        marginLeft: 8,
      },
    },
  };

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      ...sizeMap[size].badge,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      ...sizeMap[size].icon,
    },
    label: {
      fontWeight: '500',
      ...sizeMap[size].label,
    },
    availabilityContainer: {
      marginVertical: 12,
    },
    availabilityTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    seasonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    seasonItem: {
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 4,
      position: 'relative',
    },
    seasonAvailable: {
      backgroundColor: theme.colors.success + '10',
    },
    seasonUnavailable: {
      backgroundColor: theme.colors.gray[200],
    },
    seasonCurrent: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    seasonLabel: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '500',
    },
    seasonLabelAvailable: {
      color: theme.colors.text,
    },
    seasonLabelUnavailable: {
      color: theme.colors.gray[500],
    },
    currentIndicator: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
    },
    yearRoundBadge: {
      marginTop: 12,
      alignSelf: 'center',
    },
  });
};

export default SeasonalBadge;