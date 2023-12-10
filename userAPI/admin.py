from django.contrib import admin
from .models import Curso, Modulo, Cuestionario, Pregunta, Respuesta, ProgresoCurso, Contenido, ProgresoUsuario
# ... (otros imports que puedas tener)

# RespuestaInline
class RespuestaInline(admin.TabularInline):
    model = Respuesta
    extra = 0

# PreguntaInline
class PreguntaInline(admin.TabularInline):
    model = Pregunta
    inlines = [RespuestaInline]
    extra = 0

# CuestionarioInline
class CuestionarioInline(admin.StackedInline):
    model = Cuestionario
    extra = 0

# ModuloInline
class ModuloInline(admin.StackedInline):
    model = Modulo
    extra = 0

# ContenidoInline
class ContenidoInline(admin.StackedInline):
    model = Contenido
    extra = 0

# CursoAdmin
@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion', 'activo')  # Agrega 'id' aquí
    list_filter = ('activo',)
    search_fields = ('nombre',)
    inlines = [ModuloInline]

# ModuloAdmin
@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')  # Agrega 'id' aquí
    inlines = [ContenidoInline, CuestionarioInline]

# CuestionarioAdmin
@admin.register(Cuestionario)
class CuestionarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'modulo', 'activo')  # Agrega 'id' aquí
    inlines = [PreguntaInline]

# PreguntaAdmin
@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('id', 'texto', 'cuestionario')  # Agrega 'id' aquí
    inlines = [RespuestaInline]

# RespuestaAdmin
@admin.register(Respuesta)
class RespuestaAdmin(admin.ModelAdmin):
    list_display = ('id', 'texto', 'pregunta', 'correcta')  # Agrega 'id' aquí

# ProgresoCursoAdmin
@admin.register(ProgresoCurso)
class ProgresoCursoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'curso', 'estado', 'fecha_inicio', 'ultima_actividad')  # Agrega 'id' aquí
    list_filter = ('estado', 'curso')
    search_fields = ('usuario__email', 'curso__nombre')

# ProgresoUsuarioAdmin
@admin.register(ProgresoUsuario)
class ProgresoUsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'curso', 'modulo', 'estado')  # Agrega 'id' aquí
    list_filter = ('estado', 'curso', 'modulo')
    search_fields = ('usuario__email', 'curso__nombre', 'modulo__nombre')

# ContenidoAdmin
@admin.register(Contenido)
class ContenidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'modulo', 'activo')  # Agrega 'id' aquí
    list_filter = ('activo',)
    search_fields = ('titulo', 'modulo__nombre')

# Agrega cualquier otra clase ModelAdmin que necesites aquí
