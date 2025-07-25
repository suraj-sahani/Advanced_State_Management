'use client';

import { useReducer, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, MapPin, CheckSquare } from 'lucide-react';

// Types
interface TodoItem {
  id: TodoId;
  text: string;
  destinationId: DestinationId;
}

interface Destination {
  id: DestinationId;
  name: string;
}

interface ItineraryState {
  destinations: Destination[];
  todos: TodoItem[];
  events: Action[];
  undos: Action[];
}

type Brand<B> = string & { __brand: B };

type DestinationId = Brand<'DestinationId'>;

type TodoId = Brand<'TodoId'>;

// Action types
type Action =
  | { type: 'ADD_DESTINATION'; id: string }
  | { type: 'UPDATE_DESTINATION'; destinationId: DestinationId; name: string }
  | { type: 'DELETE_DESTINATION'; destinationId: DestinationId }
  | { type: 'ADD_TODO'; id: string; destinationId: DestinationId; text: string }
  | { type: 'DELETE_TODO'; todoId: TodoId }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const initialState: ItineraryState = {
  destinations: [],
  todos: [],
  events: [],
  undos: [],
};

// Reducer function
function itineraryReducer(
  state: ItineraryState,
  action: Action
): ItineraryState {
  if (action.type === 'UNDO') {
    let undoneState = initialState;
    const events = [];
    const undos = [...state.undos];

    for (let eventIndex = 0; eventIndex < state.events.length; eventIndex++) {
      if (eventIndex === state.events.length - 1) {
        undos.push(state.events[eventIndex]);
      } else {
        undoneState = itineraryReducer(undoneState, state.events[eventIndex]);
        events.push(state.events[eventIndex]);
      }
    }

    return {
      ...undoneState,
      events,
      undos,
    };
  }
  if (action.type === 'REDO') {
    const lastEvent = state.undos[state.undos.length - 1];
    if (!lastEvent) return state;
    const newState = itineraryReducer(state, lastEvent);
    return {
      ...newState,
      events: [...state.events, lastEvent],
      undos: state.undos.slice(0, -1),
    };
  }

  const events = state.events.concat(action);

  switch (action.type) {
    case 'ADD_DESTINATION':
      return {
        ...state,
        events,
        undos: [],
        destinations: [
          ...state.destinations,
          { id: action.id as DestinationId, name: '' },
        ],
      };
    case 'UPDATE_DESTINATION':
      return {
        ...state,
        events,
        undos: [],
        destinations: state.destinations.map((dest) =>
          dest.id === action.destinationId
            ? { ...dest, name: action.name }
            : dest
        ),
      };
    case 'DELETE_DESTINATION':
      return {
        ...state,
        events,
        undos: [],
        destinations: state.destinations.filter(
          (dest) => dest.id !== action.destinationId
        ),
      };
    case 'ADD_TODO':
      return {
        ...state,
        events,
        undos: [],
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID() as TodoId,
            text: action.text,
            destinationId: action.destinationId,
          },
        ],
      };
    case 'DELETE_TODO':
      return {
        ...state,
        events,
        undos: [],
        todos: state.todos.filter((todo) => todo.id !== action.todoId),
      };
    default:
      return state;
  }
}

export default function ItineraryPage() {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);
  const lastInputRef = useRef<HTMLInputElement>(null);

  const handleAddDestination = () => {
    dispatch({ type: 'ADD_DESTINATION', id: crypto.randomUUID() });
    // Focus the new input after render
    setTimeout(() => {
      lastInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Travel Itinerary
          </h1>
        </div>

        <Button onClick={handleAddDestination} size="lg" className="mb-6">
          <Plus className="h-4 w-4" />
          Add Destination
        </Button>

        <div className="space-y-6">
          {state.destinations.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No destinations yet. Click &ldquo;Add Destination&rdquo; to
                  start planning your trip!
                </p>
              </CardContent>
            </Card>
          ) : (
            state.destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                todos={state.todos.filter(
                  (todo) => todo.destinationId === destination.id
                )}
                onUpdate={(destination) => {
                  dispatch({
                    type: 'UPDATE_DESTINATION',
                    destinationId: destination.id,
                    name: destination.name,
                  });
                }}
                onDelete={(destination) => {
                  dispatch({
                    type: 'DELETE_DESTINATION',
                    destinationId: destination.id,
                  });
                }}
                onAddTodo={(data) => {
                  dispatch({
                    type: 'ADD_TODO',
                    id: crypto.randomUUID(),
                    destinationId: data.destinationId,
                    text: data.text,
                  });
                }}
                onDeleteTodo={(todoId) => {
                  dispatch({
                    type: 'DELETE_TODO',
                    todoId,
                  });
                }}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-6 border-t">
        <Button
          variant="outline"
          disabled={state.events.length === 0}
          onClick={() => dispatch({ type: 'UNDO' })}
        >
          Undo
        </Button>
        <Button
          variant="outline"
          disabled={state.undos.length === 0}
          onClick={() => dispatch({ type: 'REDO' })}
        >
          Redo
        </Button>
      </div>
    </div>
  );
}

function DestinationCard({
  destination,
  todos,
  onUpdate,
  onDelete,
  onAddTodo,
  onDeleteTodo,
}: {
  destination: Destination;
  todos: TodoItem[];
  onUpdate: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
  onAddTodo: (data: { destinationId: DestinationId; text: string }) => void;
  onDeleteTodo: (todoId: TodoId) => void;
}) {
  return (
    <Card key={destination.id} className="relative">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle className="flex-1">
            <Input
              type="text"
              defaultValue={destination.name}
              onBlur={(e) =>
                onUpdate({
                  ...destination,
                  name: e.target.value,
                })
              }
              placeholder="Enter destination name"
              className="text-lg font-semibold border-none px-0 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-primary rounded-none"
            />
          </CardTitle>
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(destination)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('todo') as HTMLInputElement;
            if (input.value.trim()) {
              onAddTodo({
                destinationId: destination.id,
                text: input.value.trim(),
              });
              input.value = '';
            }
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            name="todo"
            placeholder="Add a todo item (e.g., Visit museum, Try local cuisine)"
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>

        {todos.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Things to do
              </span>
              <Badge variant="secondary">{todos.length}</Badge>
            </div>
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="flex-1 text-sm">{todo.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTodo(todo.id)}
                    className="text-muted-foreground hover:text-destructive h-auto p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No activities added yet. Add some things to do at this destination!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
