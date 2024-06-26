import { firebase } from '../../services/firebaseConfig'
import { getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './style'
const db = getDatabase();
const auth = getAuth();

export default function CreateTask({ navigation, route }) {
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [errorCreateTask, setErrorCreateTask] = useState(null)

    const validate = () => {
        if (date == "") {
            setErrorCreateTask("Informe a data da tarefa")
        } else if (description == "") {
            setErrorCreateTask("Informe a descrição da tareja")
        } else {
            setErrorCreateTask(null)
            editTask()
        }
    }

    // Função que atualiza registro no banco
    // "auth.currentUser.uid" é o id do usuário logado
    const editTask = () => {
        const taskListRef = ref(db, 'tasks/' + auth.currentUser.uid + '/' + route.params.id);
        set(taskListRef, {
            date: date,
            description: description
        });
        navigation.navigate('Tabs')
    }

    // Função que recupera os dados da terefa do banco e seta nos inputs
    const recuperarDados = () => {
        onValue(ref(db, 'tasks/' + auth.currentUser.uid + '/' + route.params.id), (snapshot) => {
            setDate(snapshot.val().date)
            setDescription(snapshot.val().description)
        });
    }

    // Hook que chama da função que recupera dos dados da tarefa do banco logo que a tela é aberta
    useEffect(() => {
        recuperarDados();
    }, [])

    return (
        <View style={styles.container}>
            {errorCreateTask != null && (
                <Text style={styles.alert}>{errorCreateTask}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder='Data'
                value={date}
                onChangeText={setDate}
            />

            <TextInput
                style={styles.input}
                placeholder='Descrição'
                value={description}
                onChangeText={setDescription}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={validate}
            >
                <Text style={styles.textButton}>Editar tarefa</Text>
            </TouchableOpacity>
        </View>
    )
}