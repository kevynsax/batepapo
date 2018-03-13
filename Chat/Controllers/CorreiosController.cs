using Correios;
using Correios.CorreiosServiceReference;
using System.Threading.Tasks;
using System.Web.Http;

namespace Chat.Controllers
{
    [RoutePrefix("api/Correios")]
    public class CorreiosController: ApiController
    {
        [Route("BuscarCepCorreiosApi")]
        public async Task<enderecoERP> BuscarCepCorreiosApi(string id)
        {
            var service = new CorreiosApi();
            var dados = (await service.consultaCEPAsync(id)).@return;
            return dados;
        }

        public void Get()
        {
            CorreiosApi service = new CorreiosApi();
            //var dados = service.    https://pagseguro.uol.com.br/desenvolvedor/simulador_de_frete_calcular.jhtml?postalCodeFrom=71964540&weight=1&value=0&postalCodeTo=72001800
        }
    }
}