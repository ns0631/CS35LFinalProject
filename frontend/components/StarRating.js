import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function StarRating({ rating, setRating, disabled }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !disabled && setRating(star)}
          disabled={disabled}
        >
          <Text style={[styles.star, rating >= star ? styles.filled : styles.empty]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 2,
  },
  filled: {
    color: '#FFD700',
    textShadowColor: '#003f5c',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  empty: {
    color: '#ccc',
  },
});
