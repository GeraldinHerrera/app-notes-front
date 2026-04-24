import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchFormProps } from '../interfaces';

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');

  const handleSearch = () => {
    if (cedula.trim() && nombre.trim()) {
      onSearch(cedula.trim(), nombre.trim());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          value={cedula}
          onChangeText={setCedula}
          placeholder="Ingrese su cédula"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese su nombre"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleSearch}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Consultando...' : 'Consultar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    width: 70,
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#cce0ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#99c2ff',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#0047b3',
    fontSize: 16,
    fontWeight: '600',
  },
});
