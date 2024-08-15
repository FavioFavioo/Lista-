import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaskList = () => {
  const [tasks, setTasks] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [newTask, setNewTask] = useState('');
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks(prevTasks => ({
        ...prevTasks,
        [activeTab]: [...prevTasks[activeTab], { text: newTask, completed: false }]
      }));
      setNewTask('');
    }
  };

  const toggleTask = (index) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: prevTasks[activeTab].map((task, i) => 
        i === index ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const deleteTask = (index) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [activeTab]: prevTasks[activeTab].filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lista de Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Diarias</TabsTrigger>
            <TabsTrigger value="weekly">Semanales</TabsTrigger>
            <TabsTrigger value="monthly">Mensuales</TabsTrigger>
          </TabsList>
          {Object.keys(tasks).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-2">
                {tasks[category].map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span 
                      onClick={() => toggleTask(index)}
                      className={`flex-grow cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {task.text}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-4">
                <Input
                  type="text"
                  placeholder="Nueva tarea..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskList;
