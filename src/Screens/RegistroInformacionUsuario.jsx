import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const InformacionPersonal = ({ navigation, route }) => {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'

    // Guardar datos en Firestore
    const handleSave = async () => {
        if (age && weight && height) {
            const auth = getAuth();
            const userId = auth.currentUser?.uid; // Obtener el UID del usuario autenticado

            if (!userId) {
                Alert.alert('Error', 'No se pudo obtener el usuario autenticado.');
                return;
            }

            const userData = {
                gender: route.params.gender || 'N/A',
                objective: route.params.objective || 'N/A',
                age,
                weight: `${weight} ${unit === 'metric' ? 'kg' : 'lbs'}`,
                height: `${height} ${unit === 'metric' ? 'm' : 'ft'}`,
            };

            try {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, userData);
                Alert.alert('Éxito', 'Datos guardados exitosamente.', [
                    { text: 'OK', onPress: () => navigation.navigate('Home') },
                ]);
            } catch (error) {
                console.error('Error al guardar datos:', error);
                Alert.alert('Error', 'Hubo un error al guardar tus datos. Intenta nuevamente.');
            }
        } else {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cuéntanos un poco de ti</Text>
            <View style={styles.switchContainer}>
                {/* Botón para seleccionar Métrico */}
                <TouchableOpacity
                    style={[styles.switchButton, unit === 'metric' && styles.selected]}
                    onPress={() => setUnit('metric')}
                >
                    <Ionicons 
                        name="fitness-outline" 
                        size={20} 
                        color={unit === 'metric' ? '#fff' : '#555'} 
                        style={styles.icon} 
                    />
                    <Text style={unit === 'metric' ? styles.selectedText : styles.buttonText}>
                        Métrico (kg, m)
                    </Text>
                </TouchableOpacity>

                {/* Botón para seleccionar Imperial */}
                <TouchableOpacity
                    style={[styles.switchButton, unit === 'imperial' && styles.selected]}
                    onPress={() => setUnit('imperial')}
                >
                    <Ionicons 
                        name="barbell-outline" 
                        size={20} 
                        color={unit === 'imperial' ? '#fff' : '#555'} 
                        style={styles.icon} 
                    />
                    <Text style={unit === 'imperial' ? styles.selectedText : styles.buttonText}>
                        Imperial (lbs, ft)
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Campo de texto para la edad */}
            <TextInput
                style={styles.input}
                placeholder="Edad"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            {/* Campo de texto para el peso */}
            <TextInput
                style={styles.input}
                placeholder={`Peso (${unit === 'metric' ? 'kg' : 'lbs'})`}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

            {/* Campo de texto para la altura */}
            <TextInput
                style={styles.input}
                placeholder={`Altura (${unit === 'metric' ? 'm' : 'ft'})`}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />

            {/* Botón para guardar */}
            <TouchableOpacity
                style={[styles.saveButton, (!age || !weight || !height) && styles.disabledButton]}
                onPress={handleSave}
                disabled={!age || !weight || !height} // Deshabilitar si faltan campos
            >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    switchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    selected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#555',
    },
    selectedText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        fontSize: 16,
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#aaa',
    },
});

export default InformacionPersonal;
