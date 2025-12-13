
import { NextResponse } from "next/server";

// Maneja POST directamente en /customer/register
export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // TODO: valida y guarda en tu backend
        // const created = await createCustomer(payload);

        return NextResponse.json(
            {message: "Customer creado correctamente" /*, data: created*/},
            {status: 201}
        );
    } catch (err: any) {
        return NextResponse.json(
            {message: err?.message || "Error creando el customer"},
            {status: 400}
        );
    }
}