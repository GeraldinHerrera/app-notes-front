import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { appService } from '../../src/services/app.service';

export default function StudentsScreen() {
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    correo: '',
    celular: '',
    materia: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setMessage(null);
    const { cedula, nombre, correo, celular, materia } = form;

    if (!cedula.trim() || !nombre.trim() || !correo.trim() || !celular.trim() || !materia.trim()) {
      setMessage({ text: 'Por favor complete todos los campos.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await appService.createStudent({
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        correo: correo.trim(),
        celular: celular.trim(),
        materia: materia.trim()
      });
      
      setMessage({ text: '¡El estudiante se guardó bien', type: 'success' });
      setForm({ cedula: '', nombre: '', correo: '', celular: '', materia: '' });

    } catch (error) {
      console.error(error);
      setMessage({ text: 'No se pudo registrar el estudiante', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        
        {message && (
          <View style={[styles.messageBox, message.type === 'success' ? styles.messageSuccess : styles.messageError]}>
            <Text style={[styles.messageText, message.type === 'success' ? styles.textSuccess : styles.textError]}>
              {message.text}
            </Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <Text style={styles.label}>Cédula</Text>
          <TextInput
            style={styles.input}
            value={form.cedula}
            onChangeText={(val) => handleChange('cedula', val)}
            keyboardType="numeric"
            placeholder="Ingrese la cédula"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={form.nombre}
            onChangeText={(val) => handleChange('nombre', val)}
            placeholder="Ingrese el nombre completo"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={form.correo}
            onChangeText={(val) => handleChange('correo', val)}
            keyboardType="email-address"
            placeholder="Ingrese el correo electrónico"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Celular</Text>
          <TextInput
            style={styles.input}
            value={form.celular}
            onChangeText={(val) => handleChange('celular', val)}
            keyboardType="phone-pad"
            placeholder="Ingrese el celular"
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.label}>Materia</Text>
          <TextInput
            style={styles.input}
            value={form.materia}
            onChangeText={(val) => handleChange('materia', val)}
            placeholder="Ingrese la materia"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0047b3" />
            ) : (
              <Text style={styles.buttonText}>Registrar</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  messageBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  messageSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  messageError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  messageText: {
    fontSize: 15,
    fontWeight: '500',
  },
  textSuccess: {
    color: '#155724',
  },
  textError: {
    color: '#721c24',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    width: 80,
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#cce0ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#99c2ff',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
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
