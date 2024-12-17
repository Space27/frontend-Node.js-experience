import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Authorization", "X-Requested-With", "X-HTTPMethod-Override", "Content-Type", "Cache-Control", "Accept"]
  });

  await app.listen(3030);
}

bootstrap();
