import { Module } from '@nestjs/common'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Components, ComponentsSchema } from './components.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Components.name, schema: ComponentsSchema }
    ])
  ],
  controllers: [ComponentsController],
  providers: [ComponentsService]
})
export class ComponentsModule {}
