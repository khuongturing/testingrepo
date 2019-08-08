from django.views.generic import TemplateView


class HomeView(TemplateView):

    template_name = 'home/index.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data()
        with open('README.md') as file:
            context['content'] = file.read()
        return context
