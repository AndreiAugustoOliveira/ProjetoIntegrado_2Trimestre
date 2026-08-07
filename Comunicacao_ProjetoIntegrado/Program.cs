using System;
using System.IO.Ports;
using System.Text.Json;
using System.Net.Http;
using System.Text;


namespace ProjetoIntegrado
{


    class Program
    {
    
        static void Main()
        {
           SerialPort porta = new SerialPort("COMX", 115200); 
           porta.Open();

          HttpClient client = new HttpClient();

          while(true)
            {
                string linha = porta.ReadLine();
                int valor = int.Parse(linha);

                Console.WriteLine("Valor recebido: " + valor);

                string json = "{" + "\"valor\":" + valor + "}";
                var conteudo = new StringContent(json, Encoding.UTF8, "application/json");
                var resposta = client.PostAsync("http://localhost:3000/leituras", conteudo).Result;

                Console.WriteLine("Status: " + resposta.StatusCode);
            }
           
        }

        
    }
 }