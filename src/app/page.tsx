"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Logo from "@/components/logo/logo";
import Loading from "@/components/loading/loading";
import moment from "moment";
import "moment/locale/pt-br";
import { FiTrash } from "react-icons/fi";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export default function Home() {
  const [openModal, setOpenModal] = useState(true);
  const [openModalAddTask, setOpenModalAddTask] = useState(false);
  const [nome, setNome] = useState<string>("");
  const [inputNome, setInputNome] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const dataHoje = new Date();

  const handleSetNome = () => {
    setNome(inputNome);
    setOpenModal(false);
    localStorage.setItem("nomeUsuario", inputNome);
  };

  const uppercaseText = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const addTask = () => {
    if (taskInput.trim()) {
      const newTask: Task = {
        id: Date.now(),
        name: taskInput,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTaskInput("");
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    const storedNome = localStorage.getItem("nomeUsuario");
    if (storedNome) {
      setNome(storedNome);
      setOpenModal(false);
    }
  }, []);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!nome && <div className={styles.overlay}></div>}
      <div id="div-filter" className={styles.divFilter}>
        <header className={styles.page}>
          <Logo />
          <h1 className={styles.title}>
            {nome ? `Bem vindo de volta, ${nome}` : "Bem vindo"}
          </h1>
          <p className={styles.date}>
            {uppercaseText(
              moment(dataHoje)
                .locale("pt-br")
                .format("dddd, D [de] MMMM [de] YYYY")
            )}
          </p>
        </header>
        <div className={styles.containerTarefas}>
          <h2>Suas tarefas de hoje</h2>
          <div className={styles.addTask}>
          </div>
          <ul>
            {tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  {task.name}
                  <button onClick={() => removeTask(task.id)}>🗑️</button>
                </li>
              ))}
          </ul>

          <h3>Tarefas Finalizadas</h3>
          <ul>
            {tasks
              .filter((task) => task.completed)
              .map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <del>{task.name}</del>
                  <button onClick={() => removeTask(task.id)}>
                    <FiTrash />
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <button
          className={styles.buttonAddTask}
          onClick={() => setOpenModalAddTask(true)}
        >
          Adicionar nova tarefa
        </button>
        {openModal && (
          <div className={styles.modalNome}>
            <h1 className={styles.titleName}>Por favor, insira seu nome</h1>
            <input
              className={styles.inputName}
              type="text"
              value={inputNome}
              onChange={(e) => setInputNome(e.target.value)}
            />
            <button
              className={styles.btnEntrar}
              onClick={handleSetNome}
              disabled={!inputNome}
            >
              Entrar
            </button>
          </div>
        )}
        {openModalAddTask && (
          <div className={styles.modalNome}>
            <h1 className={styles.titleName}>Nova tarefa</h1>
            <input
              className={styles.inputName}
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Digite"
            />
            <div>
              <button
                className={styles.btnEntrar}
                onClick={() => setOpenModalAddTask(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.btnEntrar}
                onClick={addTask}
              >
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
