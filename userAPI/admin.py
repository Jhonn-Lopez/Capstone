from django.contrib import admin
from .models import Curso, Modulo, Cuestionario, Pregunta, Respuesta, ProgresoCurso, Contenido

# Clase Inline para Respuesta, que se muestra dentro de la interfaz de Pregunta
class RespuestaInline(admin.TabularInline):
    model = Respuesta
    extra = 0

# Clase Inline para Pregunta, que se muestra dentro de la interfaz de Cuestionario
class PreguntaInline(admin.TabularInline):
    model = Pregunta
    inlines = [RespuestaInline]
    extra = 0

# Clase Inline para Cuestionario, que se muestra dentro de la interfaz de Modulo
class CuestionarioInline(admin.StackedInline):
    model = Cuestionario
    extra = 0

# Clase Inline para Modulo, que se muestra dentro de la interfaz de Curso
class ModuloInline(admin.StackedInline):
    model = Modulo
    extra = 0

# Clase Inline para Contenido, que se muestra dentro de la interfaz de Modulo
class ContenidoInline(admin.StackedInline):
    model = Contenido
    extra = 0

# Clase ModelAdmin para Curso
@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)
    inlines = [ModuloInline]

# Clase ModelAdmin para Modulo
@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    inlines = [ContenidoInline, CuestionarioInline]

# Clase ModelAdmin para Cuestionario
@admin.register(Cuestionario)
class CuestionarioAdmin(admin.ModelAdmin):
    list_display = ('modulo', 'activo')
    inlines = [PreguntaInline]

# Clase ModelAdmin para Pregunta
@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ['texto', 'cuestionario']
    inlines = [RespuestaInline]

# Clase ModelAdmin para Respuesta
@admin.register(Respuesta)
class RespuestaAdmin(admin.ModelAdmin):
    list_display = ['texto', 'pregunta', 'correcta']

# Clase ModelAdmin para ProgresoCurso
@admin.register(ProgresoCurso)
class ProgresoCursoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'curso', 'estado', 'fecha_inicio', 'ultima_actividad')
    list_filter = ('estado', 'curso')
    search_fields = ('usuario__email', 'curso__nombre')

@admin.register(Contenido)
class ContenidoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'modulo', 'activo', 'get_duracion_video')
    list_filter = ('activo', 'modulo')
    search_fields = ('titulo', 'descripcion')
    fields = ('modulo', 'titulo', 'descripcion', 'video', 'imagen', 'archivo', 'activo')

    def get_duracion_video(self, obj):
        return obj.duracion_video if obj.duracion_video else 'No especificado'
    get_duracion_video.short_description = 'Duración del Video'

# Si tienes un ModelAdmin o inlines adicionales, asegúrate de registrarlos también.
