import { BotState } from "@bot-whatsapp/bot/dist/types";

export type History = { role: "user" | "system"; content: string };

function getHistory (_state: BotState, k = 5) {
  const history = _state.get<History[]>('history') ?? [];
  const limitHistory = history.slice(-k);
  return limitHistory
}

function getHistoryParse (_state: BotState, k = 20): string {
  const history = _state.get<History[]>('history') ?? [];
  const limitHistory = history.slice(-k);
    
  return limitHistory.reduce((prev, current) => {
    const msg = current.role === 'user' ? `\nCliente: "${current.content}"` : `\nVendedor: "${current.content}"`
    prev += msg
    return prev
  }, ``)
} 

async function handleHistory  (inside: History, _state: BotState) {
  const history = _state.get<History[]>('history') ?? [];
  history.push(inside);

  await _state.update({history})
}

async function clearHistory (_state: BotState) {
  _state.clear()
}

export { getHistory, getHistoryParse, handleHistory, clearHistory }