using System;
using System.IO.Ports;
using System.Net.Http;
using System.Text;

namespace ProjetoIntegrado
{
    class Program
    {
        static void Main()
        {
            SerialPort porta = new SerialPort("COM3", 115200);
            porta.Open();

            HttpClient client = new HttpClient();

            while (true)
            {
                string linha = porta.ReadLine();

                Console.WriteLine("Recebido: " + linha);

                string[] partes = linha.Split('|');

               string valorTexto = partes[1].Replace("ADC_VAL=", "");
               string filtroTexto = partes[2].Replace("F=", "");

               int valor = int.Parse(valorTexto);
               int filtro = int.Parse(filtroTexto);

               Console.WriteLine("Valor recebido: " + valor);
               Console.WriteLine("Filtro: " + (filtro == 1 ? "Ligado" : "Desligado"));

               string json = "{" +
                  "\"valor\":" + valor + "," +
                  "\"filtro\":" + filtro +
                "}";

                var conteudo = new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );

                var resposta = client.PostAsync(
                    "http://localhost:3000/leituras",
                    conteudo
                ).Result;

                Console.WriteLine("Status: " + resposta.StatusCode);
            }
        }
    }
}