import asyncio
from websockets.asyncio.server import serve

async def hande_new_websocket(websocket):
    async for message in websocket:
        print(message)
        await websocket.send(message)

async def main():
    # Start the server
    # Port 8765 is the default port for websockets
    # but we use 8000 to keep it uniform with the rest of the course material
    async with serve(hande_new_websocket, "localhost", 8000) as server:
        await server.serve_forever()
    
asyncio.run(main())