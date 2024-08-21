import { Text, TextProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export function ThemedText(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = useThemeColor({}, 'text');

  return <Text style={[{ color }, style]} {...otherProps} />;
}
