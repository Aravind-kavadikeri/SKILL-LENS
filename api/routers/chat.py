import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from models.schemas import ChatRequest, ChatResponse
from services.rag_chat_service import RAGChatbot

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])
chatbot = RAGChatbot()


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    return chatbot.chat(
        message=req.message,
        conversation_id=req.conversation_id,
        context=req.context,
    )


@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    conversation_id = None

    try:
        while True:
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                message = parsed.get("message", data)
                conv_id = parsed.get("conversation_id", conversation_id)
            except json.JSONDecodeError:
                message = data
                conv_id = conversation_id

            result = chatbot.chat(message=message, conversation_id=conv_id)
            conversation_id = result["conversation_id"]

            await websocket.send_json(result)
    except WebSocketDisconnect:
        pass
