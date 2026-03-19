import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import methodOverride from "method-override";
import path from "node:path";
import { ensureProductsTable } from "./config/dynamodb";
import productRoutes from "./routes/productRoutes";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use((req: Request, res: Response, next: NextFunction) => {
	const success = req.query.success;
	const error = req.query.error;

	res.locals.successMessage = typeof success === "string" ? success : "";
	res.locals.errorMessage = typeof error === "string" ? error : "";
	next();
});

app.use("/", productRoutes);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
	res.status(400).redirect(`/?error=${encodeURIComponent(error.message)}`);
});

app.use((_req: Request, res: Response) => {
	res.status(404).redirect("/?error=Đường dẫn không tồn tại");
});

async function startServer(): Promise<void> {
	try {
		await ensureProductsTable();
		app.listen(port, () => {
			// eslint-disable-next-line no-console
			console.log(`Server is running at http://localhost:${port}`);
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Không thể khởi động ứng dụng:", error);
		process.exit(1);
	}
}

void startServer();
