import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SearchForm } from '../../src/components/SearchForm';
import { appService } from '../../src/services/app.service';

export default function NotesScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);

  const [notes, setNotes] = useState({
    nota1: '',
    nota2: '',
    nota3: '',
    nota4: ''
  });
  
  const [definitivaVisible, setDefinitivaVisible] = useState(false);
  const [definitiva, setDefinitiva] = useState('');

  const handleSearch = async (cedula: string, nombre: string) => {
    try {
      setLoading(true);
      setMessage(null);
      setStudentId(null);
      setDefinitivaVisible(false);
      setDefinitiva('');
      setNotes({ nota1: '', nota2: '', nota3: '', nota4: '' });
      
      const data = await appService.searchStudentId(cedula, nombre);
      const foundId = data?.estudiante_id;

      if (foundId) {
        setStudentId(foundId);
        setMessage({ text: 'Estudiante encontrado. Registre sus notas.', type: 'success' });
      } else {
        setMessage({ text: 'No se encontró el estudiante.', type: 'error' });
      }
    } catch (error: any) {
      console.error(error);
      setMessage({ text: 'Error: Estudiante no encontrado.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateDefinitiva = () => {
    const n1 = parseFloat(notes.nota1) || 0;
    const n2 = parseFloat(notes.nota2) || 0;
    const n3 = parseFloat(notes.nota3) || 0;
    const n4 = parseFloat(notes.nota4) || 0;
    const def = (n1 + n2 + n3 + n4) / 4;
    setDefinitiva(def.toFixed(2));
    setDefinitivaVisible(true);
  };

  const handleSaveNotes = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      
      const notePayload: any = {
        estudiante_id: studentId,
        nota1: parseFloat(notes.nota1) || 0,
        nota2: parseFloat(notes.nota2) || 0,
        nota3: parseFloat(notes.nota3) || 0,
        nota4: parseFloat(notes.nota4) || 0,
      };

      if (definitivaVisible) {
        notePayload.definitiva = parseFloat(definitiva);
      }

      await appService.createNote(notePayload);
      setMessage({ text: 'Se registraron las notas correctamente', type: 'success' });
      
      setStudentId(null);
      setDefinitivaVisible(false);
      setDefinitiva('');
      setNotes({ nota1: '', nota2: '', nota3: '', nota4: '' });

    } catch (error) {
      console.error(error);
      setMessage({ text: 'No se pudieron registrar las notas.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        
        {message && (
          <View style={[styles.messageBox, message.type === 'success' ? styles.messageSuccess : styles.messageError]}>
            <Text style={[styles.messageText, message.type === 'success' ? styles.textSuccess : styles.textError]}>
              {message.text}
            </Text>
          </View>
        )}

        <SearchForm onSearch={handleSearch} isLoading={loading && !studentId} />

        {studentId && (
          <View style={styles.formContainer}>
            {['nota1', 'nota2', 'nota3', 'nota4'].map((notaKey, index) => (
              <View style={styles.inputRow} key={notaKey}>
                <Text style={styles.label}>Nota {index + 1}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={(notes as any)[notaKey]}
                  onChangeText={(val) => setNotes(prev => ({ ...prev, [notaKey]: val }))}
                  placeholder="0.0"
                />
              </View>
            ))}

            <View style={styles.actionsContainer}>
              {definitivaVisible && (
                <View style={styles.defContainer}>
                  <Text style={styles.defLabel}>Definitiva:</Text>
                  <TextInput
                    style={[styles.input, styles.definitivaInput]}
                    value={definitiva}
                    editable={false}
                  />
                </View>
              )}
              
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.calcButton} onPress={handleCalculateDefinitiva}>
                  <Text style={styles.calcButtonText}>Definitiva</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.saveButton, loading && styles.disabled]} 
                  onPress={handleSaveNotes}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
    padding: 20,
    width: '100%',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    width: 60,
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
  actionsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  defContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  defLabel: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  definitivaInput: {
    flex: 0,
    width: 80,
    backgroundColor: '#e6ffe6',
    borderColor: '#b3ffb3',
    color: '#006600',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcButton: {
    backgroundColor: '#e6f0ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b3d1ff',
  },
  calcButtonText: {
    color: '#005ce6',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.7,
  }
});
