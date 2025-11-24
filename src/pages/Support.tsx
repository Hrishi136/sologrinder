import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";

interface Donor {
  id: string;
  hunter_name: string;
  created_at: string;
}

export default function Support() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    // Fetch existing donors
    fetchDonors();

    // Set up realtime subscription
    const channel = supabase
      .channel('donors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donors'
        },
        () => {
          fetchDonors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDonors = async () => {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donors:', error);
    } else {
      setDonors(data || []);
    }
  };

  const handleDonate = () => {
    window.open('https://razorpay.me/@sologrinder', '_blank');
  };

  return (
    <div className="min-h-screen bg-system-bg bg-particles p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex items-center gap-2 text-system-blue border-system-blue hover:bg-system-blue/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-system-blue mb-4 drop-shadow-[0_2px_6px_#00d4ff]">
            Support the App
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed">
            Keep the app free for everyone! Every contribution helps us improve and grow.
          </p>
        </div>

        {/* Donation Section */}
        <div className="bg-system-panel border-2 border-system-blue2 rounded-lg p-8 mb-8 shadow-blue-glow">
          <div className="text-center">
            <Heart className="h-16 w-16 text-system-blue mx-auto mb-4" />
            <h2 className="font-orbitron text-2xl font-bold text-system-blue mb-4">
              Make a Difference
            </h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Your support helps us maintain servers, add new features, and keep the app running smoothly for all hunters.
            </p>
            <Button 
              onClick={handleDonate}
              className="bg-gradient-to-r from-system-blue to-system-blue2 hover:from-system-blue2 hover:to-system-glow text-white font-orbitron font-bold px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#00d4ff]"
            >
              <Heart className="h-5 w-5 mr-2" />
              Donate Now
            </Button>
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="bg-system-panel border-2 border-system-blue2 rounded-lg p-8 shadow-blue-glow">
          <div className="text-center mb-6">
            <Sparkles className="h-12 w-12 text-system-glow mx-auto mb-3" />
            <h2 className="font-orbitron text-3xl font-bold text-system-glow mb-2">
              Hall of Fame
            </h2>
            <p className="text-white/80">
              Legendary hunters who support our mission
            </p>
          </div>

          {donors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-system-blue/20 to-system-glow/20 border border-system-glow/50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#00e0ff] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glowing aura effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-system-glow/10 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="h-12 w-12 bg-gradient-to-br from-system-blue to-system-glow rounded-full mx-auto mb-3 flex items-center justify-center shadow-[0_0_15px_#00d4ff]">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-orbitron font-bold text-system-glow text-lg drop-shadow-[0_2px_4px_#00e0ff]">
                        {donor.hunter_name}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">
                        Legendary Supporter
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-system-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-system-blue/60" />
              </div>
              <p className="text-white/60 font-orbitron">
                Be the first legendary supporter!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}