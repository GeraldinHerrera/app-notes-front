import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SearchForm } from '../../src/components/SearchForm';
import { appService } from '../../src/services/app.service';
import { Note } from '../../src/interfaces';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async (cedula: string, nombre: string) => {
    try {
      setLoading(true);
      setNotes([]); 
      setMessage(null);
      
      const data = await appService.getNotesByStudent(cedula, nombre);
      
      if (Array.isArray(data) && data.length > 0) {
        setNotes(data);
      } else if (data && !Array.isArray(data)) {
        setNotes([data as any]);
      } else {
        setMessage('El usuario no tiene notas.');
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        setMessage('El usuario no tiene notas.');
      } else {
        setMessage('No se pudo consultar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <SearchForm onSearch={handleSearch} isLoading={loading} />

        {loading && <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />}

        {message && !loading && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        {notes.length > 0 && !loading && (
          <View style={styles.listContainer}>
            {notes.map((note, idx) => (
              <View key={note.id || idx} style={styles.resultsContainer}>
                {note.materia ? <Text style={styles.resultText}>Materia: {note.materia}</Text> : null}
                <Text style={styles.resultText}>Nota 1: {note.nota1}</Text>
                <Text style={styles.resultText}>Nota 2: {note.nota2}</Text>
                <Text style={styles.resultText}>Nota 3: {note.nota3}</Text>
                <Text style={styles.resultText}>Nota 4: {note.nota4}</Text>
                
                <View style={styles.divider} />
                <Text style={styles.definitivaText}>Definitiva: {note.definitiva}</Text>
              </View>
            ))}
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
  loader: {
    marginTop: 20,
  },
  messageBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    marginTop: 10,
    alignItems: 'center',
  },
  messageText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    marginTop: 10,
  },
  resultsContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '80%',
    marginVertical: 10,
  },
  definitivaText: {
    fontSize: 18,
    color: '#006600',
    fontWeight: 'bold',
  }
});
